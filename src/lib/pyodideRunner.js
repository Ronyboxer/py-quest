/*
 * pyodideRunner.js
 * ----------------
 * A thin, reusable wrapper around Pyodide. We load the interpreter exactly
 * once (module-level promise singleton) and reuse it for every Run / Submit.
 *
 * All execution happens inside a small Python harness (HARNESS, below) so that:
 *   - stdout / stderr are captured cleanly per run,
 *   - a Python exception becomes structured data instead of crashing the UI,
 *   - test cases are evaluated in Python where `==` has real semantics
 *     (e.g. comparing lists, dicts, floats), then reported back as JSON.
 *
 * The harness exposes three functions we call from JS:
 *   _pq_run(code, stdin)                  -> {stdout, stderr, error}
 *   _pq_test_return(code, fn, tests)      -> {error, results:[...]}
 *   _pq_test_stdout(code, tests)          -> {error, results:[...]}
 */

let pyodidePromise = null

// Python-side test harness. Defined once after Pyodide boots.
// Exported so it can be unit-tested against a Node Pyodide build.
export const HARNESS = `
import json, io, contextlib, traceback

def _pq_fresh_ns(stdin=""):
    """A namespace with input() wired to canned stdin lines."""
    ns = {}
    lines = iter(stdin.split("\\n")) if stdin else iter([])
    def _input(prompt=""):
        try:
            return next(lines)
        except StopIteration:
            raise EOFError("EOF: no more input")
    ns["input"] = _input
    return ns

def _pq_run(code, stdin=""):
    out, err = io.StringIO(), io.StringIO()
    result = {"stdout": "", "stderr": "", "error": None}
    ns = _pq_fresh_ns(stdin)
    try:
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            exec(code, ns)
    except Exception:
        # Trim the harness frames so the user sees only their own traceback.
        result["error"] = traceback.format_exc()
    result["stdout"] = out.getvalue()
    result["stderr"] = err.getvalue()
    return json.dumps(result)

def _pq_test_return(code, func_name, tests_json):
    tests = json.loads(tests_json)
    payload = {"error": None, "results": []}
    ns = _pq_fresh_ns()
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            exec(code, ns)
    except Exception:
        payload["error"] = traceback.format_exc()
        return json.dumps(payload)
    func = ns.get(func_name)
    if not callable(func):
        payload["error"] = (
            "Couldn't find a function named '" + func_name + "'. "
            "Make sure your function is defined with that exact name."
        )
        return json.dumps(payload)
    for t in tests:
        args = t.get("args", [])
        expected = t.get("expected")
        entry = {
            "args_repr": ", ".join(repr(a) for a in args),
            "expected_repr": repr(expected),
            "passed": False,
            "actual_repr": None,
            "error": None,
        }
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                actual = func(*[_pq_thaw(a) for a in args])
            entry["actual_repr"] = repr(actual)
            entry["passed"] = bool(_pq_eq(actual, expected))
        except Exception:
            entry["error"] = traceback.format_exc()
        payload["results"].append(entry)
    return json.dumps(payload)

def _pq_test_stdout(code, tests_json):
    tests = json.loads(tests_json)
    payload = {"error": None, "results": []}
    for t in tests:
        stdin = t.get("stdin", "")
        expected = t.get("expected", "")
        entry = {
            "args_repr": repr(stdin) if stdin else "(no input)",
            "expected_repr": expected,
            "passed": False,
            "actual_repr": "",
            "error": None,
        }
        out = io.StringIO()
        ns = _pq_fresh_ns(stdin)
        try:
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
                exec(code, ns)
            actual = out.getvalue()
            entry["actual_repr"] = actual
            entry["passed"] = actual.strip() == expected.strip()
        except Exception:
            entry["actual_repr"] = out.getvalue()
            entry["error"] = traceback.format_exc()
        payload["results"].append(entry)
    return json.dumps(payload)

def _pq_thaw(v):
    """JSON gives lists; some problems want tuples. Leave as-is by default."""
    return v

def _pq_eq(a, b):
    """Lenient equality: tuples vs lists compare by contents; floats approx."""
    if isinstance(a, float) or isinstance(b, float):
        try:
            return abs(a - b) < 1e-9
        except TypeError:
            return a == b
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(_pq_eq(x, y) for x, y in zip(a, b))
    return a == b
`

/**
 * Load Pyodide once and run the harness. Returns the live pyodide instance.
 * Safe to call repeatedly — concurrent callers share the same promise.
 *
 * @param {(msg: string) => void} [onStatus] progress messages for the UI
 */
export function getPyodide(onStatus = () => {}) {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      onStatus('Downloading Python runtime…')
      if (typeof window.loadPyodide !== 'function') {
        throw new Error('Pyodide failed to load from the CDN.')
      }
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
      })
      onStatus('Warming up the interpreter…')
      await pyodide.runPythonAsync(HARNESS)
      onStatus('Ready!')
      return pyodide
    })()
  }
  return pyodidePromise
}

/** Run arbitrary code for the "Run" button. Never throws on Python errors. */
export async function runCode(code, stdin = '') {
  const pyodide = await getPyodide()
  const fn = pyodide.globals.get('_pq_run')
  try {
    const json = fn(code, stdin)
    return JSON.parse(json)
  } finally {
    fn.destroy()
  }
}

/**
 * Evaluate user code against a challenge's test cases.
 * Returns { error, results: [{ passed, args_repr, expected_repr, actual_repr, error }] }
 */
export async function runTests(code, challenge) {
  const pyodide = await getPyodide()
  const tests = JSON.stringify(challenge.testCases || [])
  if (challenge.checkType === 'return') {
    const fn = pyodide.globals.get('_pq_test_return')
    try {
      return JSON.parse(fn(code, challenge.functionName, tests))
    } finally {
      fn.destroy()
    }
  }
  // default: stdout
  const fn = pyodide.globals.get('_pq_test_stdout')
  try {
    return JSON.parse(fn(code, tests))
  } finally {
    fn.destroy()
  }
}
