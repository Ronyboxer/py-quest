import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import Console from './Console'
import { runCode, runTests } from '../lib/pyodideRunner'

/**
 * The two-pane coding challenge: problem on the left, editor + console on the
 * right (stacked on mobile). Run executes real code; Submit grades against
 * hidden test cases and, on all-pass, calls onSolved().
 */
export default function ChallengeScreen({ node, pyReady, onBack, onSolved, alreadyDone }) {
  const [code, setCode] = useState(node.starterCode || '')
  const [output, setOutput] = useState(null)
  const [busy, setBusy] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const [statusMsg, setStatusMsg] = useState(null)

  async function handleRun() {
    setBusy(true)
    setStatusMsg(null)
    try {
      const res = await runCode(code)
      setOutput({ kind: 'run', ...res })
    } catch (e) {
      setOutput({ kind: 'run', stdout: '', stderr: '', error: String(e) })
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit() {
    setBusy(true)
    setStatusMsg(null)
    try {
      const res = await runTests(code, node)
      setOutput({ kind: 'tests', ...res })
      const allPass =
        !res.error && res.results.length > 0 && res.results.every((r) => r.passed)
      if (allPass) {
        onSolved()
      } else {
        const passed = res.results.filter((r) => r.passed).length
        setStatusMsg(
          res.error
            ? 'Fix the error above, then try again.'
            : `${passed} / ${res.results.length} tests passed — keep going!`,
        )
      }
    } catch (e) {
      setOutput({ kind: 'tests', error: String(e), results: [] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <button
        onClick={onBack}
        className="text-ink-soft hover:text-ink font-bold mb-4 flex items-center gap-1"
      >
        ← Back to map
      </button>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Problem statement ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-locked p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wide text-white bg-sky rounded-full px-2.5 py-0.5">
                {node.difficulty}
              </span>
              <span className="text-xs font-bold text-gold">+{node.xp} XP</span>
              {alreadyDone && (
                <span className="text-xs font-bold text-brand-dark">✓ completed</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold mb-3">{node.title}</h1>
            <p className="whitespace-pre-wrap leading-relaxed text-ink">{node.prompt}</p>
          </div>

          {/* Hints */}
          {node.hints?.length > 0 && (
            <div className="bg-white rounded-3xl border border-locked p-5 shadow-sm">
              <div className="font-extrabold text-ink-soft mb-2 flex items-center gap-2">
                💡 Hints
              </div>
              <div className="space-y-2">
                {node.hints.slice(0, revealedHints).map((h, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm bg-cloud rounded-xl px-3 py-2"
                  >
                    {h}
                  </motion.p>
                ))}
                {revealedHints < node.hints.length && (
                  <button
                    onClick={() => setRevealedHints((n) => n + 1)}
                    className="text-sm font-bold text-sky hover:underline"
                  >
                    Reveal hint {revealedHints + 1} of {node.hints.length}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Editor + console ── */}
        <div className="space-y-3">
          <div className="rounded-3xl overflow-hidden border border-locked shadow-sm">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-mono text-gray-400 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2">solution.py</span>
            </div>
            <Editor
              height="320px"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                tabSize: 4,
                automaticLayout: true,
                lineNumbers: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Console output */}
          <div className="rounded-3xl bg-[#1e1e1e] min-h-[110px] max-h-[260px] overflow-auto border border-locked shadow-sm">
            <Console output={output} />
          </div>

          {statusMsg && (
            <p className="text-sm font-bold text-streak text-center">{statusMsg}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={!pyReady || busy}
              className="btn-3d flex-1 py-3 bg-white !text-ink border-2 border-locked"
              style={{ '--shadow-color': '#d0d0d0' }}
            >
              {busy ? '…' : '▶ Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!pyReady || busy}
              className="btn-3d flex-1 py-3 bg-brand"
              style={{ '--shadow-color': 'var(--color-brand-dark)' }}
            >
              {busy ? 'Checking…' : 'Submit'}
            </button>
          </div>
          {!pyReady && (
            <p className="text-xs text-center text-ink-soft">Python is still loading…</p>
          )}
        </div>
      </div>
    </div>
  )
}
