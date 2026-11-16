// The Page editor's own furniture: the toolbar, the screen picker with its
// per-screen dots, a screen icon's context menu, and the settings of the two
// elements the toolbar places itself - the text box and the icon.
//
// Recorded on the "Docs: Flowboard and pages" app, whose single page holds a
// title text box, a circular gauge and an icon, laid out on the phone (the
// screen the editor opens on and the one that fills its pane).
//
// The console - the assistant drawer - is closed first: it covers the lower
// half of the window. The page canvas is a device frame: its screen box is
// measured once and every click on a widget is computed from the design
// coordinates, so moving a widget does not break the script.
module.exports = {
  name: 'page-editor-panels',
  description: 'Page editor: toolbar, screen picker, screen menu, text box and icon settings (PNGs)',
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
    await page.waitForTimeout(1200)

    /** The centre of a widget, from the box the page editor draws it in. */
    const widgetAt = id => page.evaluate(wid => {
      const el = document.getElementById(wid) || document.querySelector(`[data-widget-id="${wid}"]`)
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }
    }, id)

    const TEXT = 'u5L0sYYBHaE'   // the title text box
    const GAUGE = 'S0hPnRuAhLI'  // the oven's circular gauge
    const toolbar = { x: 1264, y: 45, width: 388, height: 40 }
    const picker = page.getByRole('button', { name: 'All screens & settings' }).first()

    // 1. the toolbar, nothing selected: the pen and the bin are grey
    await page.mouse.move(1450, 600)
    await page.waitForTimeout(600)
    await m.focus(toolbar, 8)
    await m.still('page-editor-toolbar')

    // 2. the screen picker. The dots only say something about a selected
    //    widget, so the gauge is picked first: it has its own layout on the
    //    phone (grey) and derives from Extra Large (copper).
    await m.unfocus()
    const gauge = await widgetAt(GAUGE)
    await page.mouse.click(gauge.x, gauge.y)
    await page.waitForTimeout(900)
    await picker.click()
    await page.waitForTimeout(1200)
    await page.mouse.move(1640, 600)
    await page.waitForTimeout(700)
    await m.focus({ x: 1264, y: 45, width: 388, height: 96 }, 8)
    await m.still('page-editor-screens')

    // 3. a screen icon's own settings, on Extra Large where the alignment
    //    entry is offered
    await m.unfocus()
    await page.mouse.click(1479, 101, { button: 'right' })
    await page.waitForTimeout(1300)
    await m.focus({ x: 1302, y: 82, width: 208, height: 112 }, 12)
    await m.still('page-editor-screen-menu')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(700)

    // 4 + 5. the settings of the text box and of the icon, each opened by a
    //        double-click on the element. Both dialogs open over the
    //        flowboard, left of the page editor; the tab the docs point at is
    //        the one that holds what the page talks about.
    await m.unfocus()
    const panel = { x: 896, y: 42, width: 354, height: 430 }
    const shortPanel = { x: 896, y: 42, width: 354, height: 300 }

    const text = await widgetAt(TEXT)
    await page.mouse.dblclick(text.x, text.y)
    await page.waitForTimeout(2500)
    await page.getByRole('tab', { name: /content/i }).first().click()
    await page.waitForTimeout(1500)
    await page.mouse.move(700, 700)
    await page.waitForTimeout(500)
    await m.focus(shortPanel, 0)
    await m.still('page-editor-text-box-settings')

    await m.unfocus()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)
    await page.mouse.click(1450, 700)
    await page.waitForTimeout(600)
    await page.mouse.dblclick(1588, 164)
    await page.waitForTimeout(2500)
    await page.getByRole('tab', { name: /look/i }).first().click()
    await page.waitForTimeout(1500)
    await page.mouse.move(700, 700)
    await page.waitForTimeout(500)
    await m.focus({ ...panel, height: 625 }, 0)
    await m.still('page-editor-icon-settings')
  }
}
