#!/usr/bin/env node
'use strict'
/**
 * Records the screenshots and GIFs of the docs from the running platform.
 *
 * Usage
 *   node record.js <storyboard>...        record these (a name in ./storyboards or a path)
 *   node record.js --all                  record every storyboard
 *   node record.js --list                 show the storyboards and what they produce
 *
 * Options
 *   --out <dir>     write results here instead of .gitbook/assets
 *   --frames        also dump every frame as PNG (into <out>/<name>-frames) for debugging
 *
 * A storyboard is a module exporting
 *   name      basename of the result, e.g. 'drag-function-to-canvas'
 *   login     true when it starts signed in (credentials from .env)
 *   viewport  optional { width, height }, default 1280x800
 *   run       async ({ page, m, env }) => { ... }   m is the Recorder, see lib.js
 *
 * More than one frame gives <name>.gif; exactly one frame gives <name>.png;
 * every m.still('x') gives x.png in addition.
 */
const fs = require('fs')
const path = require('path')
const lib = require('./lib')

const STORYBOARDS = path.join(__dirname, 'storyboards')

function parseArgs (argv) {
  const opts = { targets: [], out: lib.ASSETS, frames: false, all: false, list: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--out') opts.out = path.resolve(argv[++i])
    else if (a === '--frames') opts.frames = true
    else if (a === '--all') opts.all = true
    else if (a === '--list') opts.list = true
    else if (a.startsWith('--')) throw new Error(`Unknown option ${a}`)
    else opts.targets.push(a)
  }
  return opts
}

function allStoryboards () {
  return fs.readdirSync(STORYBOARDS).filter(f => f.endsWith('.js')).sort().map(f => path.join(STORYBOARDS, f))
}

function resolveStoryboard (target) {
  const candidates = [target, path.join(STORYBOARDS, target), path.join(STORYBOARDS, `${target}.js`)]
  const file = candidates.find(c => fs.existsSync(c) && fs.statSync(c).isFile())
  if (!file) throw new Error(`No storyboard "${target}" (looked in ${STORYBOARDS})`)
  return path.resolve(file)
}

async function record (file, opts, env, browser) {
  const story = require(file)
  if (!story.name || typeof story.run !== 'function') throw new Error(`${file} must export name and run()`)
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: story.viewport || lib.DEFAULT_VIEWPORT,
    deviceScaleFactor: 1
  })
  await context.addInitScript(lib.CURSOR_INIT)
  const page = await context.newPage()
  const m = new lib.Recorder(page)
  try {
    if (story.login) await lib.login(page, env)
    await story.run({ page, m, env })
  } finally {
    await context.close()
  }

  fs.mkdirSync(opts.out, { recursive: true })
  const written = []
  if (m.frames.length > 1) {
    const out = path.join(opts.out, `${story.name}.gif`)
    fs.writeFileSync(out, lib.encodeGif(m.frames))
    const optimized = lib.optimizeGif(out)
    written.push(`${out} (${m.frames.length} frames, ${mb(out)}${optimized ? ', gifsicle' : ''})`)
  } else if (m.frames.length === 1) {
    const out = path.join(opts.out, `${story.name}.png`)
    fs.writeFileSync(out, m.frames[0].png)
    written.push(`${out} (${mb(out)})`)
  }
  for (const s of m.stills) {
    const out = path.join(opts.out, `${s.name}.png`)
    fs.writeFileSync(out, s.png)
    written.push(`${out} (${mb(out)})`)
  }
  if (opts.frames && m.frames.length) {
    const dir = path.join(opts.out, `${story.name}-frames`)
    fs.mkdirSync(dir, { recursive: true })
    m.frames.forEach((f, i) => fs.writeFileSync(path.join(dir, `${String(i).padStart(3, '0')}.png`), f.png))
    written.push(`${dir}/ (${m.frames.length} PNGs)`)
  }
  return written
}

const mb = file => `${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB`

async function main () {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.list) {
    for (const file of allStoryboards()) {
      const s = require(file)
      console.log(`${path.basename(file, '.js').padEnd(32)} ${s.login ? '(login) ' : '        '}${s.description || ''}`)
    }
    return
  }
  const files = opts.all ? allStoryboards() : opts.targets.map(resolveStoryboard)
  if (!files.length) throw new Error('Nothing to record; name a storyboard, or use --all / --list')

  const env = lib.loadEnv()
  const browser = await lib.launchBrowser(env)
  let failed = 0
  try {
    for (const file of files) {
      const label = path.basename(file, '.js')
      const started = Date.now()
      try {
        const written = await record(file, opts, env, browser)
        console.log(`${label}: ${((Date.now() - started) / 1000).toFixed(1)}s`)
        for (const w of written) console.log(`  ${w}`)
      } catch (err) {
        failed++
        console.error(`${label}: FAILED\n  ${err.message.split('\n')[0]}`)
      }
    }
  } finally {
    await browser.close()
  }
  process.exitCode = failed ? 1 : 0
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
