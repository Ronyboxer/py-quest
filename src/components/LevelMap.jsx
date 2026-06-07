import { motion } from 'framer-motion'
import { curriculum, isUnlocked, nodeOrder } from '../data/curriculum'

/**
 * The vertical skill tree. Units stack top to bottom; within a unit, nodes
 * wind left-right like a path. Completed = filled, current = highlighted +
 * bouncing, locked = greyed and disabled.
 */
export default function LevelMap({ progress, onOpen }) {
  // The "current" node is the first uncompleted node in course order.
  const currentId = nodeOrder.find((id) => !progress.completed[id]) ?? null

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold">Learn Python, one quest at a time</h1>
        <p className="text-ink-soft mt-1">Tap a node to start. Finish it to unlock the next.</p>
      </div>

      <div className="space-y-12">
        {curriculum.map((unit) => (
          <section key={unit.id}>
            {/* Unit banner */}
            <div
              className="rounded-2xl px-5 py-4 mb-6 text-white shadow-sm"
              style={{ backgroundColor: unit.color }}
            >
              <div className="text-xs font-bold uppercase tracking-widest opacity-90">
                {unit.title}
              </div>
              <div className="font-bold text-lg leading-tight">{unit.blurb}</div>
            </div>

            {/* Winding node path */}
            <div className="flex flex-col items-center gap-6">
              {unit.nodes.map((node, i) => {
                const done = !!progress.completed[node.id]
                const unlocked = isUnlocked(node.id, progress.completed)
                const isCurrent = node.id === currentId
                // gentle left-center-right zigzag
                const offset = [0, -64, 64, -36, 36][i % 5]
                return (
                  <div
                    key={node.id}
                    style={{ transform: `translateX(${offset}px)` }}
                  >
                    <MapNode
                      node={node}
                      color={unit.color}
                      done={done}
                      unlocked={unlocked}
                      isCurrent={isCurrent}
                      onOpen={() => unlocked && onOpen(node.id)}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="text-center text-ink-soft text-sm mt-12">
        🎉 More units are just data away — edit{' '}
        <code className="text-xs">src/data/curriculum.js</code>.
      </p>
    </div>
  )
}

function MapNode({ node, color, done, unlocked, isCurrent, onOpen }) {
  const isLesson = node.type === 'lesson'
  const icon = done ? '✓' : isLesson ? '★' : '⌨'

  return (
    <div className="flex flex-col items-center gap-1.5">
      {isCurrent && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-extrabold text-brand-dark bg-brand-light px-2.5 py-0.5 rounded-full shadow-sm"
        >
          START
        </motion.div>
      )}
      <motion.button
        onClick={onOpen}
        disabled={!unlocked}
        whileHover={unlocked ? { scale: 1.08 } : {}}
        whileTap={unlocked ? { scale: 0.94 } : {}}
        animate={isCurrent ? { y: [0, -5, 0] } : {}}
        transition={isCurrent ? { repeat: Infinity, duration: 1.6 } : {}}
        className="relative w-[68px] h-[68px] rounded-full grid place-items-center text-2xl font-extrabold text-white disabled:cursor-not-allowed"
        style={{
          backgroundColor: done ? color : unlocked ? color : 'var(--color-locked)',
          boxShadow: unlocked
            ? `0 6px 0 0 rgba(0,0,0,0.18)`
            : '0 4px 0 0 rgba(0,0,0,0.08)',
          opacity: unlocked ? 1 : 0.7,
          color: unlocked ? '#fff' : '#9a9a9a',
        }}
        title={unlocked ? node.title : 'Locked — finish the previous node'}
      >
        {unlocked ? icon : '🔒'}
        {isCurrent && (
          <span
            className="absolute inset-0 rounded-full ring-4 ring-offset-2"
            style={{ '--tw-ring-color': color, color }}
          />
        )}
      </motion.button>
      <span
        className={`text-xs font-bold text-center max-w-[120px] ${
          unlocked ? 'text-ink' : 'text-ink-soft'
        }`}
      >
        {node.title}
      </span>
    </div>
  )
}
