/*
 * End-to-end browser smoke test against the running dev server.
 * Confirms: app mounts, Pyodide loads from CDN, Run produces real output,
 * Submit grades correctly, XP is awarded, and progress persists to localStorage.
 */
import { chromium } from 'playwright'

const URL = process.env.URL || 'http://localhost:5188/'
const browser = await chromium.launch({ channel: 'chrome' })
const context = await browser.newContext({
  permissions: ['clipboard-read', 'clipboard-write'],
})
const page = await context.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

await page.goto(URL, { waitUntil: 'networkidle' })

// App mounted?
await page.waitForSelector('text=PyQuest', { timeout: 10000 })
console.log('✓ app mounted')

// Wait for Pyodide ready: the loading ribbon disappears.
await page.waitForFunction(() => !document.body.textContent.includes('Loading Python'), {
  timeout: 60000,
})
console.log('✓ Pyodide loaded in browser')

// Open the first node (a lesson) and finish it.
await page.locator('button[title="Meet print()"]').click({ force: true })
await page.waitForSelector('text=Saying hello')
// Click through "Continue" then "Got it!"
await page.getByRole('button', { name: /Continue/ }).click()
await page.getByRole('button', { name: /Got it/ }).click()
await page.waitForSelector('text=Lesson complete!')
console.log('✓ lesson completes + celebration modal shows')
await page.getByRole('button', { name: /Continue/ }).click()

// Now on the Hello World challenge. Type a solution into Monaco.
await page.waitForSelector('text=Hello, World!')
await page.locator('.monaco-editor .view-lines').first().click()
// clear starter, then PASTE the solution (avoids Monaco auto-closing brackets)
await page.keyboard.press('Meta+A')
await page.keyboard.press('Backspace')
await page.evaluate(() =>
  navigator.clipboard.writeText('print("Hello, World!")'),
)
await page.keyboard.press('Meta+V')

// Run → expect output to appear in the console panel specifically
await page.getByRole('button', { name: /Run/ }).first().click()
await page.waitForFunction(
  () => {
    const panels = document.querySelectorAll('.font-mono')
    return [...panels].some((p) => p.innerText.trim() === 'Hello, World!')
  },
  { timeout: 20000 },
)
console.log('✓ Run produced real stdout')

// Submit → expect pass + celebration
await page.getByRole('button', { name: /Submit/ }).click()
await page.waitForSelector('text=Lesson complete!', { timeout: 20000 })
console.log('✓ Submit graded all-pass and celebrated')

// XP persisted to localStorage?
const stored = await page.evaluate(() => localStorage.getItem('pyquest:v1'))
const prog = JSON.parse(stored)
if (prog.xp > 0 && prog.completed['u1-c1']) {
  console.log(`✓ progress persisted (xp=${prog.xp}, streak=${prog.streak})`)
} else {
  throw new Error('progress not persisted: ' + stored)
}

if (errors.length) {
  console.log('\n⚠ console errors:\n' + errors.join('\n'))
}

await browser.close()
console.log('\nSMOKE TEST PASSED ✅')
