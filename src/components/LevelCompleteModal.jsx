import { motion } from 'framer-motion'

/** A satisfying level-complete celebration with XP earned and confetti. */
export default function LevelCompleteModal({ xp, streak, hasNext, onNext, onMap }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
    >
      <Confetti />
      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, -12, 12, -8, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8 }}
          className="text-6xl mb-2"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-extrabold">Lesson complete!</h2>
        <p className="text-ink-soft mb-5">Nice work — you nailed it.</p>

        <div className="flex justify-center gap-3 mb-6">
          <div className="flex-1 rounded-2xl bg-gold/15 border-2 border-gold py-3">
            <div className="text-2xl font-extrabold text-gold">+{xp}</div>
            <div className="text-xs font-bold text-ink-soft">XP earned</div>
          </div>
          <div className="flex-1 rounded-2xl bg-streak/15 border-2 border-streak py-3">
            <div className="text-2xl font-extrabold text-streak">🔥 {streak}</div>
            <div className="text-xs font-bold text-ink-soft">day streak</div>
          </div>
        </div>

        <div className="space-y-2">
          {hasNext && (
            <button
              onClick={onNext}
              className="btn-3d w-full py-3 bg-brand"
              style={{ '--shadow-color': 'var(--color-brand-dark)' }}
            >
              Continue
            </button>
          )}
          <button
            onClick={onMap}
            className="btn-3d w-full py-3 bg-white !text-ink border-2 border-locked"
            style={{ '--shadow-color': '#d0d0d0' }}
          >
            Back to map
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Lightweight CSS-free confetti using a handful of animated divs. */
function Confetti() {
  const colors = ['#58cc02', '#ffc800', '#1cb0f6', '#ff4b4b', '#ce82ff']
  const pieces = Array.from({ length: 40 })
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = (i * 37) % 100
        const delay = (i % 10) * 0.08
        const color = colors[i % colors.length]
        const size = 6 + (i % 4) * 2
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: '100vh', rotate: 360, opacity: [1, 1, 0] }}
            transition={{ duration: 2.2 + (i % 5) * 0.3, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        )
      })}
    </div>
  )
}
