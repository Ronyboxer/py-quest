import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { AnimatePresence, motion } from 'framer-motion'
import { runCode } from '../lib/pyodideRunner'

/**
 * A teaching screen: 1–3 concept cards, each with an explanation and an
 * optional runnable, editable example. "Got it" advances; the last card
 * finishes the lesson (awards XP, unlocks the next node).
 */
export default function LessonScreen({ node, pyReady, onBack, onFinish }) {
  const [step, setStep] = useState(0)
  const screen = node.screens[step]
  const isLast = step === node.screens.length - 1

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <button
        onClick={onBack}
        className="text-ink-soft hover:text-ink font-bold mb-4 flex items-center gap-1"
      >
        ← Back to map
      </button>

      {/* progress dots */}
      <div className="flex gap-1.5 mb-5">
        {node.screens.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-brand' : 'bg-locked'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-locked p-6 sm:p-8 shadow-sm"
        >
          <div className="text-xs font-extrabold uppercase tracking-wide text-brand-dark mb-2">
            {node.title}
          </div>
          <h1 className="text-2xl font-extrabold mb-3">{screen.title}</h1>
          <p className="leading-relaxed text-ink mb-5">{screen.body}</p>

          {screen.example && (
            <RunnableExample example={screen.example} pyReady={pyReady} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
          className="btn-3d px-8 py-3 bg-brand"
          style={{ '--shadow-color': 'var(--color-brand-dark)' }}
        >
          {isLast ? 'Got it! ✓' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

/** A small editor pre-filled with example code the learner can tweak and run. */
function RunnableExample({ example, pyReady }) {
  const [code, setCode] = useState(example.code)
  const [output, setOutput] = useState(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    setBusy(true)
    try {
      const res = await runCode(code)
      setOutput(res.error || res.stderr || res.stdout || '(no output)')
    } catch (e) {
      setOutput(String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {example.caption && (
        <p className="text-sm text-ink-soft mb-2">{example.caption}</p>
      )}
      <div className="rounded-2xl overflow-hidden border border-locked">
        <Editor
          height="160px"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            lineNumbers: 'off',
            tabSize: 4,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
        <div className="bg-[#1e1e1e] flex items-center gap-3 px-3 py-2">
          <button
            onClick={run}
            disabled={!pyReady || busy}
            className="btn-3d px-4 py-1.5 text-sm bg-brand"
            style={{ '--shadow-color': 'var(--color-brand-dark)' }}
          >
            {busy ? '…' : '▶ Run'}
          </button>
          <pre className="flex-1 font-mono text-xs text-gray-100 whitespace-pre-wrap break-words m-0 max-h-24 overflow-auto">
            {output}
          </pre>
        </div>
      </div>
    </div>
  )
}
