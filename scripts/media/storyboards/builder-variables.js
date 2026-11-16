// The Variables explorer, on the Widget Gallery app, which carries a
// constant, a flow-fed variable and a secret beside the built-ins.
module.exports = {
  name: 'builder-variables',
  description: 'The Variables explorer with constants, a secret and the built-ins (PNG)',
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
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Variables' }).first().click()
    await page.waitForTimeout(900)
    // the rail's tooltip hangs over the first rows while the pointer rests there
    await page.mouse.move(900, 400)
    await page.waitForTimeout(1600)
    await m.still('builder-variables-explorer')
  }
}
