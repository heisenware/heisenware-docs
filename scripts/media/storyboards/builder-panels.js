// The App Builder's panels and dialogs the docs point at, in one pass on
// the "Line 2 monitor" demo app.
module.exports = {
  name: 'builder-panels',
  description: 'Builder: explorer tabs, settings dialog, version list, theme editor (PNGs)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: 'ohjg6',
      appName: 'Widget Gallery'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1000)

    // The explorer rail: its icons sit top-left under the toolbar. Each one
    // swaps the panel; the tooltips name them.
    const rail = [
      ['Functions', 'builder-functions-explorer'],
      ['Pages and actions', 'builder-pages-explorer'],
      ['Files', 'builder-files-explorer'],
      ['Variables', 'builder-variables-explorer'],
      ['Endpoints', 'builder-endpoints-explorer']
    ]
    for (const [tip, asset] of rail) {
      const icon = page.getByRole('button', { name: tip }).first()
      if (!(await icon.count())) {
        console.warn(`  (no rail icon "${tip}")`)
        continue
      }
      await icon.click()
      await page.waitForTimeout(900)
      // the rail's tooltip hangs over the panel's first rows while the
      // pointer rests on the icon that opened it
      await page.mouse.move(900, 400)
      await page.waitForTimeout(1500)
      await m.still(asset)
    }

    // The version list: the labelled Tags button in the top bar
    const tags = page.getByRole('button', { name: /^tags$/i }).first()
    if (await tags.count()) {
      await tags.click()
      await page.waitForTimeout(1800)
      await m.still('builder-versions')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
    }

    // The settings dialog: the gear in the top bar
    const gear = page.getByRole('button', { name: /settings/i }).first()
    if (await gear.count()) {
      await gear.click()
      await page.waitForTimeout(1500)
      await m.still('builder-settings')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
    }
  }
}
