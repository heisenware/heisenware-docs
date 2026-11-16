// The lab "Automating PDF reports", photographed on the App it describes:
//
//   pdf-lab-page.png   the tablet page: form, signature pad, Submit
//
// The flow itself is two pictures and has a storyboard of its own,
// pdf-lab-flow.js, because it wants a different pixel density.
//
// The App is "Docs: template editor" (ue4vw), which carries the lab's build:
// the form and the signature widget, and the chain echo -> mergeObjects ->
// addRow -> fillTemplate -> send with its error handler. Nothing here
// changes it.
const APP = { domain: 'acme.default', appId: 'ue4vw', appName: 'Docs: template editor' }

module.exports = {
  name: 'pdf-lab',
  description: 'Automating PDF reports: the tablet page (PNG)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams(APP)
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(11000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    const closeConsole = page.getByRole('button', { name: 'Close Console' })
    if (await closeConsole.count()) await closeConsole.first().click()
    await page.waitForTimeout(2500)
    await page.mouse.move(800, 500)
    await page.waitForTimeout(2000)

    // --- the page, as the Builder's page editor draws the tablet -----------
    await m.focus({ x: 1262, y: 84, width: 398, height: 682 }, 0)
    await m.still('pdf-lab-page')
  }
}
