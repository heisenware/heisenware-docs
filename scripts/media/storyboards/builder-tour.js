// The App Builder on the "Line 2 monitor" demo app: the whole workbench,
// with the Flowboard fitted and the Console open on the assistant.
module.exports = {
  name: 'builder-tour',
  description: 'The App Builder workbench (PNG)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: 'qq2gv',
      appName: 'Line 2 monitor'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)

    // the assistant offers the workspace's project notes on a fresh
    // conversation; the picture is about the workbench, not that card
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1200)

    // fit the board, then zoom back in: fitting a board that carries a wide
    // annotation card leaves the executors too small to read
    await page.mouse.click(760, 300)
    await page.keyboard.press('f')
    await page.waitForTimeout(1500)
    await page.mouse.move(640, 240)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.down('Control')
      await page.mouse.wheel(0, -240)
      await page.keyboard.up('Control')
      await page.waitForTimeout(350)
    }
    await page.waitForTimeout(2500)

    // show the assistant's greeting rather than whatever the last
    // conversation ended on
    await page.mouse.move(750, 750)
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, -400)
      await page.waitForTimeout(200)
    }
    await page.waitForTimeout(1200)

    await m.still('builder-tour')
  }
}
