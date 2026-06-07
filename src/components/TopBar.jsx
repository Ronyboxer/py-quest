import { motion } from 'framer-motion'
import { totalNodes } from '../data/curriculum'

/** Persistent top bar: logo, XP bar, streak, levels-complete count. */
export default function TopBar({ progress, onReset }) {
  const completedCount = Object.keys(progress.completed).length
  const pct = Math.min(100, Math.round((completedCount / totalNodes) * 100))

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-locked">
      <div className="mx-auto max-w-3xl px-4 h-16 flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 font-extrabold text-xl shrink-0">
          <span className="text-2xl">🐍</span>
          <span className="hidden sm:inline text-brand-dark tracking-tight">PyQuest</span>
        </div>

        {/* XP / progress bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">⚡</span>
            <div className="flex-1 h-3.5 rounded-full bg-locked overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
            <span className="text-sm font-bold text-ink-soft tabular-nums shrink-0">
              {progress.xp} XP
            </span>
          </div>
        </div>

        {/* Streak */}
        <div
          className="flex items-center gap-1 font-extrabold text-streak shrink-0"
          title="Daily streak"
        >
          <span className="text-xl">🔥</span>
          <span className="tabular-nums">{progress.streak}</span>
        </div>

        <button
          onClick={onReset}
          title="Reset all progress"
          className="text-ink-soft hover:text-ink text-sm font-bold px-2 shrink-0"
        >
          ⟳
        </button>
      </div>
    </header>
  )
}
