import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TopBar from './components/TopBar'
import LevelMap from './components/LevelMap'
import LessonScreen from './components/LessonScreen'
import ChallengeScreen from './components/ChallengeScreen'
import LevelCompleteModal from './components/LevelCompleteModal'
import { getNode, nextNodeId } from './data/curriculum'
import {
  loadProgress,
  saveProgress,
  completeNode,
  resetProgress,
} from './lib/storage'
import { getPyodide } from './lib/pyodideRunner'

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [view, setView] = useState({ name: 'map', nodeId: null })
  const [celebrate, setCelebrate] = useState(null) // { xp, nodeId }
  const [pyStatus, setPyStatus] = useState('Loading Python…')
  const [pyReady, setPyReady] = useState(false)

  // Persist progress whenever it changes.
  useEffect(() => saveProgress(progress), [progress])

  // Boot Pyodide once, in the background, while the user reads the map.
  useEffect(() => {
    let live = true
    getPyodide((msg) => live && setPyStatus(msg))
      .then(() => live && setPyReady(true))
      .catch((e) => live && setPyStatus('Failed to load Python: ' + e.message))
    return () => {
      live = false
    }
  }, [])

  const node = view.nodeId ? getNode(view.nodeId) : null

  function openNode(nodeId) {
    setView({ name: getNode(nodeId).type, nodeId })
    window.scrollTo({ top: 0 })
  }

  function goMap() {
    setView({ name: 'map', nodeId: null })
  }

  function finishNode(nodeId, xp) {
    setProgress((p) => {
      const next = completeNode(p, nodeId, xp)
      // celebrate with the freshly-updated streak
      setCelebrate({ xp, nodeId, streak: next.streak })
      return next
    })
  }

  return (
    <div className="min-h-screen">
      <TopBar
        progress={progress}
        onReset={() => {
          if (confirm('Reset all progress (XP, streak, completed levels)?')) {
            setProgress(resetProgress())
            goMap()
          }
        }}
      />

      {/* Pyodide loading ribbon */}
      {!pyReady && (
        <div className="bg-sky/10 text-sky text-sm font-bold text-center py-1.5 flex items-center justify-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-sky border-t-transparent rounded-full animate-spin" />
          {pyStatus}
        </div>
      )}

      <main>
        {view.name === 'map' && <LevelMap progress={progress} onOpen={openNode} />}

        {view.name === 'lesson' && node && (
          <LessonScreen
            key={node.id}
            node={node}
            pyReady={pyReady}
            onBack={goMap}
            onFinish={() => finishNode(node.id, node.xp)}
          />
        )}

        {view.name === 'challenge' && node && (
          <ChallengeScreen
            key={node.id}
            node={node}
            pyReady={pyReady}
            alreadyDone={!!progress.completed[node.id]}
            onBack={goMap}
            onSolved={() => finishNode(node.id, node.xp)}
          />
        )}
      </main>

      <AnimatePresence>
        {celebrate && (
          <LevelCompleteModal
            xp={celebrate.xp}
            streak={celebrate.streak}
            hasNext={!!nextNodeId(celebrate.nodeId)}
            onNext={() => {
              const nxt = nextNodeId(celebrate.nodeId)
              setCelebrate(null)
              if (nxt) openNode(nxt)
            }}
            onMap={() => {
              setCelebrate(null)
              goMap()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
