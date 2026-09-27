'use strict'
/**
 * Shared machinery for the storyboards in ./storyboards.
 *
 * A storyboard drives the platform through Playwright while the Recorder
 * captures frames; the runner (record.js) turns the frames into a GIF or a
 * PNG under .gitbook/assets. Headless Chromium draws no mouse pointer, so the
 * Recorder injects its own cursor and positions it explicitly for every
 * frame; that way drag-and-drop libraries can swallow whatever events they
 * like and the pointer still shows where the mouse is.
 */
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const { chromium } = require('playwright')
const { GIFEncoder, quantize, applyPalette } = require('gifenc')
const { PNG } = require('pngjs')

const ROOT = path.resolve(__dirname, '..', '..')
const ASSETS = path.join(ROOT, '.gitbook', 'assets')
const DEFAULT_VIEWPORT = { width: 1280, height: 800 }

// --- environment -----------------------------------------------------------

/** Reads ./.env (if present) into process.env and returns the settings. */
function loadEnv () {
  const file = path.join(__dirname, '.env')
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(["'])(.*)\1$/, '$2')
    }
  }
  return {
    baseUrl: (process.env.HW_BASE_URL || 'https://localhost').replace(/\/$/, ''),
    account: process.env.HW_ACCOUNT || '',
    email: process.env.HW_EMAIL || '',
    password: process.env.HW_PASSWORD || '',
    chromium: process.env.HW_CHROMIUM || undefined
  }
}

// --- browser ---------------------------------------------------------------

async function launchBrowser (env) {
  try {
    return await chromium.launch({
      executablePath: env.chromium,
      // fonts.conf maps the generic system font to Roboto / Liberation Sans.
      env: { ...process.env, FONTCONFIG_FILE: path.join(__dirname, 'fonts.conf') }
    })
  } catch (err) {
    if (/Executable doesn't exist/.test(err.message)) {
      throw new Error('No Chromium for this Playwright version; run `npx playwright install chromium` in scripts/media.')
    }
    if (/error while loading shared libraries/.test(err.message)) {
      const lib = (err.message.match(/shared libraries: (\S+):/) || [])[1] || 'a system library'
      throw new Error(`Chromium is missing ${lib}; run \`sudo npx playwright install-deps chromium\` once in scripts/media.`)
    }
    throw err
  }
}

/** Signs in through the manager's form; the account lands on the manager afterwards. */
async function login (page, env) {
  if (!env.account || !env.email || !env.password) {
    throw new Error('This storyboard logs in; set HW_ACCOUNT, HW_EMAIL and HW_PASSWORD in scripts/media/.env (see .env.example).')
  }
  await page.goto(`${env.baseUrl}/manager/authentication/sign-in`, { waitUntil: 'networkidle' })
  await page.getByLabel('Account Name').fill(env.account)
  await page.getByLabel('Email').fill(env.email)
  await page.getByLabel('Password').fill(env.password)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await page.waitForURL(url => !url.pathname.includes('/authentication/'), { timeout: 30000 })
  await page.waitForLoadState('networkidle')
}

// --- cursor overlay --------------------------------------------------------

// Runs inside the page before any of its own scripts, on every navigation.
const CURSOR_INIT = () => {
  const install = () => {
    if (!document.documentElement || document.getElementById('__hw_cursor')) return
    const el = document.createElement('div')
    el.id = '__hw_cursor'
    el.style.cssText = 'position:fixed;left:0;top:0;width:36px;height:36px;pointer-events:none;' +
      'z-index:2147483647;transform:translate(-6px,-4px);display:none;'
    el.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36">' +
      '<circle id="__hw_ring" cx="10" cy="8" r="13" fill="rgba(96,168,160,0.30)" stroke="rgba(96,168,160,0.95)" stroke-width="2" style="display:none"/>' +
      '<path d="M8 5 L8 24 L13 19.5 L16.5 27 L19.5 25.5 L16 18 L22.5 18 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>' +
      '</svg>'
    document.documentElement.appendChild(el)
  }
  window.__hwCursor = (x, y, pressed, visible) => {
    install()
    const el = document.getElementById('__hw_cursor')
    el.style.display = visible ? '' : 'none'
    el.style.left = x + 'px'
    el.style.top = y + 'px'
    document.getElementById('__hw_ring').style.display = pressed ? '' : 'none'
  }
  install()
  document.addEventListener('DOMContentLoaded', install)
}

// --- recorder --------------------------------------------------------------

const ease = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

class Recorder {
  constructor (page) {
    this.page = page
    this.frames = []      // { png, delay } in ms
    this.stills = []      // { name, png }
    this.cursor = { x: 0, y: 0 }
    this.pressed = false
    this.cursorVisible = false
    this.clip = null      // { x, y, width, height } or null for the full viewport
  }

  /** Resolves a locator, a { x, y } point, or [x, y] to page coordinates. */
  async point (target) {
    if (Array.isArray(target)) return { x: target[0], y: target[1] }
    if (typeof target.boundingBox === 'function') {
      const box = await target.boundingBox()
      if (!box) throw new Error('Target is not visible, cannot move the mouse there')
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    }
    return target
  }

  async draw () {
    const { x, y } = this.cursor
    await this.page.evaluate(
      ([x, y, pressed, visible]) => window.__hwCursor && window.__hwCursor(x, y, pressed, visible),
      [x, y, this.pressed, this.cursorVisible]
    )
  }

  /** Captures one GIF frame and holds it for `hold` ms. */
  async frame (hold = 80) {
    await this.draw()
    const png = await this.page.screenshot({ type: 'png', clip: this.clip || undefined })
    this.frames.push({ png, delay: hold })
  }

  /** Alias that reads better at rest points of a storyboard. */
  hold (ms) { return this.frame(ms) }

  /** Places the cursor without animating; use before the first frame. */
  async cursorAt (target) {
    this.cursor = await this.point(target)
    this.cursorVisible = true
    await this.page.mouse.move(this.cursor.x, this.cursor.y)
  }

  /** Glides the mouse to the target, capturing a frame per step. */
  async moveTo (target, { steps = 20, delay = 60 } = {}) {
    const from = { ...this.cursor }
    const to = await this.point(target)
    this.cursorVisible = true
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps)
      this.cursor = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
      await this.page.mouse.move(this.cursor.x, this.cursor.y)
      await this.frame(delay)
    }
  }

  async press (hold = 120) {
    this.pressed = true
    await this.page.mouse.down()
    await this.frame(hold)
  }

  async release (hold = 200) {
    this.pressed = false
    await this.page.mouse.up()
    await this.frame(hold)
  }

  /** Moves to the target (if given) and clicks it. */
  async click (target, opts) {
    if (target) await this.moveTo(target, opts)
    await this.press()
    await this.release()
  }

  /**
   * Drags from the current position to the target. The first few pixels are
   * moved slowly: drag-and-drop libraries only arm after a small movement.
   */
  async dragTo (target, { steps = 30, delay = 60, settle = 400 } = {}) {
    await this.press()
    const start = { ...this.cursor }
    for (const d of [2, 4, 8]) {
      this.cursor = { x: start.x + d, y: start.y + d }
      await this.page.mouse.move(this.cursor.x, this.cursor.y)
      await this.frame(delay)
    }
    await this.moveTo(target, { steps, delay })
    await this.frame(settle)
    await this.release(settle)
  }

  async type (text, { delay = 30, hold = 400 } = {}) {
    await this.page.keyboard.type(text, { delay })
    await this.frame(hold)
  }

  /** Crops every following capture to the element (plus padding) or a box. */
  async focus (target, padding = 16) {
    if (typeof target.boundingBox === 'function') {
      const box = await target.boundingBox()
      if (!box) throw new Error('Focus target is not visible')
      target = box
    }
    const vp = this.page.viewportSize()
    const x = Math.max(0, target.x - padding)
    const y = Math.max(0, target.y - padding)
    this.clip = {
      x,
      y,
      width: Math.min(vp.width - x, target.width + 2 * padding),
      height: Math.min(vp.height - y, target.height + 2 * padding)
    }
  }

  unfocus () { this.clip = null }

  /** Captures a PNG under its own name; the cursor is hidden unless asked for. */
  async still (name, { cursor = false } = {}) {
    const visible = this.cursorVisible
    this.cursorVisible = cursor
    await this.draw()
    this.stills.push({ name, png: await this.page.screenshot({ type: 'png', clip: this.clip || undefined }) })
    this.cursorVisible = visible
  }
}

// --- encoding --------------------------------------------------------------

function encodeGif (frames) {
  const gif = GIFEncoder()
  frames.forEach((f, i) => {
    const { data, width, height } = PNG.sync.read(f.png)
    const palette = quantize(data, 256, { format: 'rgb565' })
    const index = applyPalette(data, palette, 'rgb565')
    gif.writeFrame(index, width, height, { palette, delay: f.delay, repeat: i === 0 ? 0 : undefined })
  })
  gif.finish()
  return Buffer.from(gif.bytes())
}

/** Shrinks a GIF in place when gifsicle is installed; a no-op otherwise. */
function optimizeGif (file) {
  try {
    execFileSync('gifsicle', ['-O3', '-o', file, file], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

module.exports = {
  ROOT,
  ASSETS,
  DEFAULT_VIEWPORT,
  CURSOR_INIT,
  Recorder,
  loadEnv,
  launchBrowser,
  login,
  encodeGif,
  optimizeGif
}
