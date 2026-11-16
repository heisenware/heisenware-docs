// The one gesture the whole Flowboard rests on: a wire carries the value,
// and dropping the input on its own trigger makes every arrival run the
// executor. Recorded on the "Docs demo" app, whose two executors start
// unwired and side by side (checkpoint "clean-board").
//
// The grips (the dotted handles Item.jsx makes draggable) are MEASURED
// between the two drags, never hardcoded: wiring widens a node, because its
// pills come to read "from output" and "to input", so every coordinate
// after the first drop has moved.
module.exports = {
  name: 'wire-a-hot-input',
  description: 'Wiring an output to an input, then making that input hot (GIF)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const SOURCE = 'wbqKz1NOnbk' // getValues
    const TARGET = 'V7CJvatqI1g' // pushBack

    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: 'oias4',
      appName: 'Docs demo'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(600)

    await page.mouse.click(760, 450)
    await page.keyboard.press('f')
    await page.waitForTimeout(2200)

    /** The centres of one node's drag handles, left to right. */
    const grips = id => page.evaluate(nodeId => {
      const node = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`)
      // the node's own handle is an <svg>; an item's grip is a <div>
      return [...node.querySelectorAll('div[draggable="true"]')]
        .map(el => el.getBoundingClientRect())
        .filter(r => r.width > 4 && r.width < 40)
        .map(r => ({ x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }))
        .sort((a, b) => a.x - b.x)
    }, id)

    // the two nodes, with room for the wire and for the width wiring adds
    await m.focus({ x: 250, y: 258, width: 1200, height: 146 }, 14)

    const from = await grips(SOURCE)
    const to = await grips(TARGET)
    const outputGrip = from[from.length - 1]          // getValues · output
    const itemPill = { x: to[0].x - 24, y: to[0].y }  // pushBack · item

    await m.cursorAt([outputGrip.x, outputGrip.y - 40])
    await m.hold(900)

    // 1. the wire: what the output produces now reaches the input
    await m.moveTo(outputGrip, { steps: 12 })
    await m.hold(400)
    await m.dragTo(itemPill, { steps: 26, settle: 900 })
    await m.hold(1600)

    // 2. the hot input: the same input dropped on its own trigger, so every
    //    value arriving there runs the executor
    const after = await grips(TARGET)
    await m.moveTo(after[0], { steps: 12 })
    await m.hold(500)
    await m.dragTo(after[1], { steps: 30, delay: 70, settle: 1200 })
    // the drop opens the mode menu (update / change / true / all updated);
    // close it so the clip ends on the result, not on an open menu
    await m.hold(900)
    await page.keyboard.press('Escape')
    await m.hold(2600)
  }
}
