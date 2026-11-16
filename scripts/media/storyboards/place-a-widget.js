// Placing a widget: pick it in one of the three widget menus, then click the
// page. No drag - the toolbar arms the pointer and the next click on the
// canvas puts the widget there.
//
// Recorded on the "Docs: Flowboard and pages" app. The barcode widget lands
// under the oven's gauge; delete it again before re-recording.
module.exports = {
  name: 'place-a-widget',
  description: 'Picking a widget from a widget menu and clicking the page to place it (GIF)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '68edk',
      appName: 'Docs: Flowboard and pages'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Toggle Console' }).first().click()
    await page.waitForTimeout(1500)

    // the page canvas is a device frame; design coordinates map into it
    const screen = await page.evaluate(() => {
      const r = document.querySelector('.screen').getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    const DESIGN_WIDTH = 414
    const k = screen.width / DESIGN_WIDTH
    const at = (dx, dy) => ({ x: Math.round(screen.x + dx * k), y: Math.round(screen.y + dy * k) })

    // the toolbar and the page, nothing else
    await m.focus({ x: 1258, y: 42, width: 400, height: 580 }, 0)

    await m.cursorAt([1500, 560])
    await m.hold(1200)

    await m.moveTo(page.getByRole('button', { name: 'Input Widgets' }).first(), { steps: 14 })
    await m.hold(400)
    await m.click()
    await m.hold(900)

    const entry = page.getByRole('menuitem').filter({ hasText: /^Barcode \/ QR$/ }).first()
    const item = (await entry.count()) ? entry : page.locator('li', { hasText: /^Barcode \/ QR$/ }).first()
    await m.moveTo(item, { steps: 14 })
    await m.hold(500)
    await m.click()
    await m.hold(1200)

    // the click that places it
    await m.moveTo(at(207, 430), { steps: 18 })
    await m.hold(700)
    await m.click()
    await m.hold(3000)
  }
}
