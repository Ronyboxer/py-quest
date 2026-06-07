/*
 * Console.jsx — a terminal-style output panel.
 * Renders stdout, stderr, tracebacks, and per-test-case results without ever
 * letting a Python error break the React tree.
 */
export default function Console({ output }) {
  if (!output) {
    return (
      <div className="font-mono text-sm text-ink-soft p-3">
        Output will appear here. Hit{' '}
        <span className="font-bold text-brand-dark">Run</span> to execute your code.
      </div>
    )
  }

  if (output.kind === 'run') {
    const { stdout, stderr, error } = output
    const nothing = !stdout && !stderr && !error
    return (
      <div className="font-mono text-sm p-3 whitespace-pre-wrap break-words leading-relaxed">
        {stdout && <span className="text-gray-100">{stdout}</span>}
        {stderr && <span className="text-amber-300">{stderr}</span>}
        {error && <span className="text-red-400">{error}</span>}
        {nothing && (
          <span className="text-ink-soft">
            (no output — did you forget to print something?)
          </span>
        )}
      </div>
    )
  }

  if (output.kind === 'tests') {
    const { error, results } = output
    return (
      <div className="font-mono text-sm p-3 space-y-2">
        {error && (
          <div className="text-red-400 whitespace-pre-wrap break-words">
            Your code raised an error before tests could run:{'\n'}
            {error}
          </div>
        )}
        {results.map((r, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 border ${
              r.passed
                ? 'border-brand/40 bg-brand/10'
                : 'border-red-500/40 bg-red-500/10'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              <span>{r.passed ? '✅' : '❌'}</span>
              <span className={r.passed ? 'text-brand-light' : 'text-red-300'}>
                Test {i + 1} {r.passed ? 'passed' : 'failed'}
              </span>
            </div>
            {!r.passed && (
              <div className="mt-1 pl-6 text-xs text-gray-300 space-y-0.5 whitespace-pre-wrap break-words">
                {r.args_repr !== undefined && (
                  <div>
                    <span className="text-ink-soft">input:</span> {r.args_repr}
                  </div>
                )}
                <div>
                  <span className="text-ink-soft">expected:</span>{' '}
                  {JSON.stringify(r.expected_repr)}
                </div>
                <div>
                  <span className="text-ink-soft">got:</span>{' '}
                  {r.error ? '(error)' : JSON.stringify(r.actual_repr)}
                </div>
                {r.error && (
                  <div className="text-red-400 mt-1">{r.error}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return null
}
