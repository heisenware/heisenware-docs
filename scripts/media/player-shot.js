#!/usr/bin/env node
// Photographs one page of an App as the App Player renders it, at 2x
// (or any) pixel density, optionally cut to a box of the page:
//
//   node player-shot.js <appId> <pageId> <out.png> [x y width height [margin]] [--scale 2] [--released]
//
// Without --released it opens the CURRENT BUILD of an App running in
// test mode (test_app), the way the MCP screenshot tool does:
// /app/<domain>/<appId>?hwPreview=1&page=<pageId>, signed in
// anonymously. The page renders on the laptop screen (1500x750 design
// px); the box is in design px, exactly as layout_lint reports it.
// Needs HW_BASE_URL (and HW_DOMAIN, default <HW_ACCOUNT>.default) in .env.
const path = require('path')
const { loadEnv, launchBrowser } = require('./lib')

const VIEWPORT = { width: 1500, height: 750 }

async function main () {
  const argv = process.argv.slice(2)
  const flag = name => {
    const i = argv.indexOf(name)
    if (i < 0) return undefined
    const [, value] = argv.splice(i, 2)
    return value
  }
  const released = argv.includes('--released')
  if (released) argv.splice(argv.indexOf('--released'), 1)
  const scale = Number(flag('--scale') ?? 2)
  const [appId, pageId, out, ...box] = argv
  if (!appId || !pageId || !out) {
    console.error('usage: node player-shot.js <appId> <pageId> <out.png> [x y width height [margin]] [--scale 2] [--released]')
    process.exit(2)
  }
  const env = loadEnv()
  const domain = process.env.HW_DOMAIN || `${env.account}.default`
  const params = new URLSearchParams({ page: pageId })
  if (!released) params.set('hwPreview', '1')
  const url = `${env.baseUrl}/app/${domain}/${appId}?${params}`

  const browser = await launchBrowser(env)
  try {
    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: scale, ignoreHTTPSErrors: true })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    // the player boots, then page-load executors deliver: wait for widgets, then let charts animate in
    await page.waitForSelector('[data-widget-id], .dx-widget, canvas, svg', { timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(3000)
    let clip
    if (box.length >= 4) {
      const [x, y, w, h, m = 0] = box.map(Number)
      clip = {
        x: Math.max(0, x - m),
        y: Math.max(0, y - m),
        width: Math.min(VIEWPORT.width, x + w + m) - Math.max(0, x - m),
        height: Math.min(VIEWPORT.height, y + h + m) - Math.max(0, y - m)
      }
    }
    await page.screenshot({ path: path.resolve(out), clip })
    console.log(`${out}: ${clip ? `${clip.width}x${clip.height}` : `${VIEWPORT.width}x${VIEWPORT.height}`} design px at ${scale}x`)
  } finally {
    await browser.close()
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
