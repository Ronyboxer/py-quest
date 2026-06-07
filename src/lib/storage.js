/*
 * storage.js — all progress lives in localStorage. No backend, no auth.
 *
 * Shape:
 *   {
 *     version: 1,
 *     xp: number,
 *     completed: { [nodeId]: true },
 *     streak: number,
 *     lastActiveDay: 'YYYY-MM-DD' | null,
 *   }
 */

const KEY = 'pyquest:v1'

const EMPTY = {
  version: 1,
  xp: 0,
  completed: {},
  streak: 0,
  lastActiveDay: null,
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return { ...EMPTY, ...parsed, completed: { ...parsed.completed } }
  } catch {
    return { ...EMPTY }
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // storage full / disabled — fail silently, app still works in-memory
  }
}

/** Local calendar day as YYYY-MM-DD. */
function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

function dayDiff(a, b) {
  // whole days between two YYYY-MM-DD strings (b - a)
  const da = new Date(a + 'T00:00:00')
  const db = new Date(b + 'T00:00:00')
  return Math.round((db - da) / 86400000)
}

/**
 * Update the daily streak based on the last active day.
 * Same day → unchanged. Consecutive day → +1. Gap → reset to 1.
 */
export function touchStreak(progress) {
  const t = today()
  if (progress.lastActiveDay === t) return progress
  let streak = 1
  if (progress.lastActiveDay) {
    const diff = dayDiff(progress.lastActiveDay, t)
    if (diff === 1) streak = progress.streak + 1
    else if (diff <= 0) streak = progress.streak || 1
  }
  return { ...progress, streak, lastActiveDay: t }
}

/** Mark a node complete and award XP (idempotent — XP only granted once). */
export function completeNode(progress, nodeId, xp) {
  if (progress.completed[nodeId]) return progress
  const next = touchStreak(progress)
  return {
    ...next,
    xp: next.xp + xp,
    completed: { ...next.completed, [nodeId]: true },
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  return { ...EMPTY }
}
