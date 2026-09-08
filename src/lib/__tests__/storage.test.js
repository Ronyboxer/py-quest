import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'

import {
  completeNode,
  loadProgress,
  resetProgress,
  saveProgress,
  touchStreak,
} from '../storage'

const KEY = 'pyquest:v1'

beforeEach(() => {
  localStorage.clear()
  vi.useRealTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

/** The YYYY-MM-DD string storage.js would produce for a given Date. */
function dayString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

describe('loadProgress', () => {
  it('returns an empty profile when nothing is stored', () => {
    expect(loadProgress()).toEqual({
      version: 1,
      xp: 0,
      completed: {},
      streak: 0,
      lastActiveDay: null,
    })
  })

  it('falls back to an empty profile when the stored value is not JSON', () => {
    localStorage.setItem(KEY, 'not json at all')
    expect(loadProgress().xp).toBe(0)
  })

  it('fills in missing fields from an older stored shape', () => {
    localStorage.setItem(KEY, JSON.stringify({ xp: 120, completed: { 'u1-l1': true } }))

    const progress = loadProgress()

    expect(progress.xp).toBe(120)
    expect(progress.completed).toEqual({ 'u1-l1': true })
    expect(progress.streak).toBe(0)
    expect(progress.version).toBe(1)
  })

  it('copies the completed map instead of aliasing the parsed object', () => {
    localStorage.setItem(KEY, JSON.stringify({ completed: { 'u1-l1': true } }))

    const a = loadProgress()
    const b = loadProgress()
    a.completed['u1-l2'] = true

    expect(b.completed).toEqual({ 'u1-l1': true })
  })
})

describe('persistence round-trip', () => {
  it('saves and reloads a profile unchanged', () => {
    const progress = {
      version: 1,
      xp: 355,
      completed: { 'u1-l1': true, 'u2-c1': true },
      streak: 4,
      lastActiveDay: '2026-09-07',
    }

    saveProgress(progress)

    expect(loadProgress()).toEqual(progress)
  })

  it('resetProgress clears the stored key and returns an empty profile', () => {
    saveProgress({ version: 1, xp: 99, completed: { a: true }, streak: 3, lastActiveDay: '2026-09-07' })

    const cleared = resetProgress()

    expect(localStorage.getItem(KEY)).toBeNull()
    expect(cleared.xp).toBe(0)
    expect(cleared.completed).toEqual({})
  })
})

describe('touchStreak', () => {
  it('starts a streak at 1 on the first ever day', () => {
    const next = touchStreak({ ...loadProgress() })

    expect(next.streak).toBe(1)
    expect(next.lastActiveDay).toBe(dayString(new Date()))
  })

  it('leaves the profile untouched when already active today', () => {
    const progress = { ...loadProgress(), streak: 6, lastActiveDay: dayString(new Date()) }

    expect(touchStreak(progress)).toBe(progress)
  })

  it('increments on a consecutive day', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const progress = { ...loadProgress(), streak: 3, lastActiveDay: dayString(yesterday) }

    expect(touchStreak(progress).streak).toBe(4)
  })

  it('resets to 1 after a gap of more than one day', () => {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const progress = { ...loadProgress(), streak: 12, lastActiveDay: dayString(lastWeek) }

    expect(touchStreak(progress).streak).toBe(1)
  })
})

describe('completeNode', () => {
  it('awards XP and records the node', () => {
    const next = completeNode(loadProgress(), 'u1-l1', 30)

    expect(next.xp).toBe(30)
    expect(next.completed['u1-l1']).toBe(true)
  })

  it('is idempotent, so replaying a lesson does not farm XP', () => {
    const once = completeNode(loadProgress(), 'u1-l1', 30)
    const twice = completeNode(once, 'u1-l1', 30)

    expect(twice.xp).toBe(30)
    expect(twice).toBe(once)
  })

  it('accumulates XP across different nodes', () => {
    let progress = loadProgress()
    progress = completeNode(progress, 'u1-l1', 30)
    progress = completeNode(progress, 'u1-c1', 45)

    expect(progress.xp).toBe(75)
    expect(Object.keys(progress.completed)).toHaveLength(2)
  })

  it('marks the day active, so finishing a node counts toward the streak', () => {
    const next = completeNode(loadProgress(), 'u1-l1', 30)

    expect(next.streak).toBe(1)
    expect(next.lastActiveDay).toBe(dayString(new Date()))
  })

  it('does not mutate the profile it was given', () => {
    const before = loadProgress()
    completeNode(before, 'u1-l1', 30)

    expect(before.xp).toBe(0)
    expect(before.completed).toEqual({})
  })
})
