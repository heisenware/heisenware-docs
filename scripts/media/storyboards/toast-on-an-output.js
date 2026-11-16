// A toast is an App action, not a widget: you drag it from the foot of the
// Pages and actions explorer onto the item that should pop it, and the
// action asks for its settings there and then.
//
// Recorded on the "Docs demo" app (checkpoint "clean-board-and-widget").
// The output's grip is measured at run time, because fitting the board
// decides where the node lands.
module.exports = {
  name: 'toast-on-an-output',
  description: 'Dropping the Toast action on an executor output (GIF)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const SOURCE = 'wbqKz1NOnbk' // getValues

    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: 'oias4',
      appName: 'Docs demo'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Pages and actions' }).first().click()
    await page.waitForTimeout(1200)
    await page.mouse.click(700, 450)
    await page.keyboard.press('f')
    await page.waitForTimeout(2000)

    const grips = await page.evaluate(nodeId => {
      const n = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`)
      return [...n.querySelectorAll('div[draggable="true"]')]
        .map(e => e.getBoundingClientRect())
        .filter(r => r.width > 4 && r.width < 40)
        .map(r => ({ x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }))
        .sort((a, b) => a.x - b.x)
    }, SOURCE)
    const output = grips[grips.length - 1]

    // the chips at the foot of the explorer, the executor, and the dialog
    // the drop opens, all in one frame
    await m.focus({ x: 20, y: 170, width: 1060, height: 760 }, 12)

    const toastChip = { x: 90, y: 895 }
    await m.cursorAt([toastChip.x, toastChip.y - 50])
    await m.hold(1000)
    await m.moveTo(toastChip, { steps: 12 })
    await m.hold(500)

    // onto the output: every truthy value it produces will pop the toast
    await m.dragTo({ x: output.x - 26, y: output.y }, { steps: 34, delay: 60, settle: 1200 })
    await m.hold(1600)

    // the action asks for what it needs, right where it landed
    // OK stays disabled until the message is there: the action's own schema
    // marks it required
    const message = page.getByRole('textbox', { name: /message/i }).first()
    await m.click(message)
    await m.hold(300)
    await m.type('Filler read', { delay: 75 })
    await m.hold(1000)

    await m.click(page.getByRole('button', { name: /^ok$/i }).first())
    // the chip on the output ("Toast: Filler read") appears once the dialog
    // has closed and the node has re-rendered: hold long enough to show it
    await m.hold(1500)
    await m.hold(4200)
  }
}
