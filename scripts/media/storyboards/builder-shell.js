// The pieces of the Builder shell the docs point at, shot on the "Docs:
// manager" app: the Files explorer's context menu, the navigation menu's
// settings, the Switch page chip on a filter, and the top bar's right side.
//
// The app must be STOPPED, so the top bar reads TEST and not STOP.
module.exports = {
  name: 'builder-shell',
  description: 'Builder: deploy bar, files context menu, menu settings, a widget link, a switch-page chip (PNGs)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '970n8',
      appName: 'Docs: manager'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)

    // the console takes the lower half; the board needs the room
    await page.getByRole('button', { name: 'Toggle Console' }).first().click()
    await page.waitForTimeout(800)

    // --- 1. the top bar's right side: version, Test, Deploy ----------------
    await m.focus({ x: 1272, y: 0, width: 392, height: 41 }, 0)
    await m.still('builder-deploy-bar')
    m.unfocus()

    /** The union of the elements a selector matches, in viewport pixels. */
    const union = sel => page.evaluate(s => {
      const boxes = [...document.querySelectorAll(s)]
        .map(e => e.getBoundingClientRect())
        .filter(r => r.width > 80 && r.height > 40)
      if (!boxes.length) return null
      const x = Math.min(...boxes.map(b => b.x))
      const y = Math.min(...boxes.map(b => b.y))
      return {
        x,
        y,
        width: Math.max(...boxes.map(b => b.x + b.width)) - x,
        height: Math.max(...boxes.map(b => b.y + b.height)) - y
      }
    }, sel)

    // --- 2. the Files explorer, right-clicked ------------------------------
    await page.getByRole('button', { name: 'Files' }).first().click()
    await page.waitForTimeout(2200)
    // a file in uploads: the second row of the list
    await page.mouse.click(140, 163, { button: 'right' })
    // the menu grows into place; measuring it mid-animation cuts it off
    await page.waitForTimeout(1600)
    const menu = await union('[role="menu"], .MuiMenu-paper, .MuiPopover-paper')
    if (!menu) throw new Error('no context menu on the file row')
    const left = 33
    await m.focus({
      x: left,
      y: 44,
      width: Math.max(222, menu.x + menu.width + 10 - left),
      height: Math.max(400, menu.y + menu.height + 14 - 44)
    }, 0)
    await m.still('files-context-menu')
    m.unfocus()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(600)

    // --- 3. the navigation menu's settings ---------------------------------
    await page.getByRole('button', { name: 'Pages and actions' }).first().click()
    await page.waitForTimeout(1600)
    // the icon beside the PAGES title: "configure the navigation menu"
    await page.mouse.click(236, 63)
    await page.waitForTimeout(1600)
    // open the Type list, so the picture names the menu types
    const settings = page.locator('.MuiPopover-paper').filter({ hasText: 'Menu Settings' })
    const type = settings.getByRole('combobox').first()
    if (await type.count()) {
      await type.click()
      await page.waitForTimeout(1200)
    }
    await page.mouse.move(1500, 700)
    const dialog = await union('.MuiPopover-paper, [role="listbox"]')
    if (!dialog) throw new Error('no menu settings popover')
    await m.focus(dialog, 14)
    await m.still('builder-menu-settings')
    m.unfocus()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(700)

    // --- the board ----------------------------------------------------------
    // It opens at 1:1 with the extensions off to the right; a middle-drag pans
    // it 1:1, so walk a node into the canvas rather than fitting the board,
    // which would shrink it to nothing.
    const rect = async id => page.evaluate(i => {
      const n = document.querySelector(`.react-flow__node[data-id="${i}"]`)
      if (!n) return null
      const r = n.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    }, id)

    /** Walks a node into the middle of the canvas with a middle-button drag. */
    const panTo = async (id, toX, toY) => {
      let node = await rect(id)
      if (!node) throw new Error(`no node ${id} on the board`)
      for (let i = 0; i < 6 && node; i++) {
        const dx = toX - (node.x + node.width / 2)
        const dy = toY - (node.y + node.height / 2)
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) break
        // one drag may not reach: the pointer has to stay on the canvas
        await page.mouse.move(840, 500)
        await page.mouse.down({ button: 'middle' })
        await page.mouse.move(
          840 + Math.max(-700, Math.min(700, dx)),
          500 + Math.max(-350, Math.min(350, dy)),
          { steps: 10 }
        )
        await page.mouse.up({ button: 'middle' })
        await page.waitForTimeout(500)
        node = await rect(id)
      }
      await page.mouse.move(1500, 820)
      await page.waitForTimeout(600)
      return rect(id)
    }

    // --- 4. a widget link, as the board and the page show it ----------------
    // The modifier's item reads "set value" and carries the widget badge; the
    // value box it feeds stands in the Page editor beside it. That is what a
    // link is: no code between the two.
    const link = await panTo('TwdEzypsow0', 1000, 196)
    await m.focus({ x: link.x - 26, y: 90, width: 1660 - (link.x - 26), height: 268 }, 0)
    await m.still('widget-link')
    m.unfocus()

    // --- 5. the Switch page chip on a filter --------------------------------
    const node = await panTo('Xjyn0HdOcC4', 700, 480)
    await m.focus(node, 20)
    await m.still('switch-page-link')
    m.unfocus()
  }
}
