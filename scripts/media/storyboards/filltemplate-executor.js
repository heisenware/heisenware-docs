// The fillTemplate executor for reference/functions/utilities/pdf-templates.md:
// one node on its own board, both inputs named, nothing wired into them, so
// the picture says what the function takes - an object of `values` and the
// `options`.
//
// It sits in its own App ("Docs: pdf templates", epokt) and not in the lab's,
// because a wired `values` reads "from output" on the node and the parameter's
// name disappears.
//
// The return normally previews the rendered document in an
// <object type="application/pdf">; headless Chromium has no PDF viewer, so
// this node is photographed unrun.
const APP = { domain: 'acme.default', appId: 'epokt', appName: 'Docs: pdf templates' }
const EXECUTOR = 'IaUc6PCoqIw'

module.exports = {
  name: 'filltemplate-executor',
  description: 'The fillTemplate executor with its values and options inputs (PNG)',
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
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Toggle Explorer' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Toggle Page editor' }).click()
    await page.waitForTimeout(1500)

    await page.mouse.click(800, 500)
    await page.keyboard.press('f')
    await page.waitForTimeout(3000)
    const mini = page.getByRole('button', { name: 'Hide mini map' })
    if (await mini.count()) await mini.first().click()
    await page.waitForTimeout(1000)

    const node = () => page.evaluate(id => {
      const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    }, EXECUTOR)

    // a plain wheel pans this board; Ctrl+wheel zooms it around the pointer
    let box = await node()
    if (!box) throw new Error(`no fillTemplate node ${EXECUTOR} on this board`)
    await page.keyboard.down('Control')
    for (let i = 0; i < 14 && box.width < 780; i++) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.wheel(0, -200)
      await page.waitForTimeout(600)
      const next = await node()
      if (!next || next.width <= box.width + 1) { box = next || box; break }
      box = next
    }
    await page.keyboard.up('Control')
    await page.mouse.move(Math.min(1600, box.x + box.width / 2), Math.max(60, box.y - 140))
    await page.waitForTimeout(1500)
    box = await node()
    await m.focus(box, 18)
    await m.still('filltemplate-executor')
  }
}
