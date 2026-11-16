#!/usr/bin/env node
'use strict'
/**
 * Renders a diagram (an SVG file) to a PNG for the docs, at 2x so it stays
 * sharp on a retina screen. Diagrams are drawn by hand as SVG and kept in
 * `diagrams/`, so a later release can re-render or amend them instead of
 * someone redrawing a picture nobody has the source of.
 *
 * Usage
 *   node diagram.js <name>...        diagrams/<name>.svg -> ../../.gitbook/assets/<name>.png
 *   node diagram.js --all
 *   node diagram.js <name> --out out
 *
 * The page references the PNG with half its pixel width, e.g. a 1200 px
 * render is `width="600"`, or GitBook stretches it.
 */
const fs = require('fs')
const path = require('path')
const lib = require('./lib')

const DIAGRAMS = path.join(__dirname, 'diagrams')

async function render (file, outDir, browser) {
  const svg = fs.readFileSync(file, 'utf8')
  const { width, height } = sizeOf(svg)
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2
  })
  const page = await context.newPage()
  // the SVG alone on a white page: no margin, no scrollbars
  await page.setContent(
    `<!doctype html><meta charset="utf-8">
     <style>html,body{margin:0;padding:0;background:#fff;overflow:hidden}</style>${svg}`,
    { waitUntil: 'load' }
  )
  await page.waitForTimeout(150) // let web fonts settle
  const out = path.join(outDir, `${path.basename(file, '.svg')}.png`)
  await page.screenshot({ path: out, omitBackground: false })
  await context.close()
  return out
}

/** The SVG's own width and height, which decide the render size. */
function sizeOf (svg) {
  const w = /\bwidth="(\d+)"/.exec(svg)
  const h = /\bheight="(\d+)"/.exec(svg)
  const box = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(svg)
  const width = Number(w?.[1] ?? box?.[1])
  const height = Number(h?.[1] ?? box?.[2])
  if (!width || !height) throw new Error('The SVG needs a width and a height, or a viewBox')
  return { width: Math.round(width), height: Math.round(height) }
}

async function main () {
  const args = process.argv.slice(2)
  const outIndex = args.indexOf('--out')
  const outDir = outIndex >= 0
    ? path.resolve(args[outIndex + 1])
    : path.join(__dirname, '..', '..', '.gitbook', 'assets')
  const names = args.filter((a, i) => !a.startsWith('--') && !(outIndex >= 0 && i === outIndex + 1))
  const files = args.includes('--all')
    ? fs.readdirSync(DIAGRAMS).filter(f => f.endsWith('.svg')).map(f => path.join(DIAGRAMS, f))
    : names.map(n => {
      const file = n.endsWith('.svg') ? path.resolve(n) : path.join(DIAGRAMS, `${n}.svg`)
      if (!fs.existsSync(file)) throw new Error(`No diagram ${n} (looked for ${file})`)
      return file
    })
  if (!files.length) throw new Error('Name a diagram, or use --all')

  fs.mkdirSync(outDir, { recursive: true })
  const browser = await lib.launchBrowser({})
  try {
    for (const file of files) {
      const out = await render(file, outDir, browser)
      const kb = (fs.statSync(out).size / 1024).toFixed(0)
      console.log(`${path.basename(out)} (${kb} kB)`)
    }
  } finally {
    await browser.close()
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
