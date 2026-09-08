import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// App boots Pyodide from a CDN on mount. There is no interpreter to download
// in jsdom, so stub the module: these tests are about the app shell, not
// Python execution.
vi.mock('../lib/pyodideRunner', () => ({
  getPyodide: () => new Promise(() => {}),
  HARNESS: '',
}))

import App from '../App'
import { curriculum } from '../data/curriculum'
import { saveProgress } from '../lib/storage'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

/** Match an element by its own normalized text, not a fragment of it. */
function hasText(expected) {
  return (_content, element) =>
    element?.textContent.replace(/\s+/g, ' ').trim() === expected
}

describe('App', () => {
  it('renders the level map on first load', () => {
    render(<App />)

    expect(screen.getByText(curriculum[0].title)).toBeInTheDocument()
  })

  it('shows every unit title', () => {
    render(<App />)

    for (const unit of curriculum) {
      expect(screen.getByText(unit.title)).toBeInTheDocument()
    }
  })

  it('starts a fresh learner at zero XP', () => {
    render(<App />)

    // The bar renders "{xp} XP" as two text nodes, so match on the element's
    // whole text. Matching bare "0" would also hit the streak counter.
    expect(screen.getByText(hasText('0 XP'))).toBeInTheDocument()
  })

  it('reads existing progress out of localStorage on mount', () => {
    saveProgress({
      version: 1,
      xp: 240,
      completed: {},
      streak: 5,
      lastActiveDay: '2026-09-07',
    })

    render(<App />)

    expect(screen.getByText(hasText('240 XP'))).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('writes progress back to localStorage after mounting', () => {
    render(<App />)

    expect(localStorage.getItem('pyquest:v1')).not.toBeNull()
  })
})
