// A section: select the executors of one stage and press the group icon, and
// the board draws a titled frame around them.
//
// Recorded on the "Docs: Flowboard and pages" app, whose two OPC UA executors
// are one stage - opening the session to the oven and monitoring its
// temperature. Selecting several executors is Ctrl and a click on each: a
// plain drag on the canvas pans it.
//
// Delete the section again (delete_section) before re-recording.
//
// The annotation card must be off the board while this is recorded: Fit View
// frames everything on the canvas, and a card off to the side shrinks the two
// nodes to nothing. Delete it, record, and create it again.
module.exports = {
  name: 'frame-a-section',
  description: 'Framing two executors into a section on the Flowboard (GIF)',
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
    await page.waitForTimeout(800)
    const mm = page.getByRole('button', { name: 'Hide mini map' })
    if (await mm.count()) await mm.first().click()
    await page.waitForTimeout(400)
    // a click on the pane itself, never on a node: a stray click lands in a
    // node's comment field and the next keypress is typed into it
    await page.locator('.react-flow__pane').click({ position: { x: 40, y: 40 } })
    await page.keyboard.press('f')
    await page.waitForTimeout(2500)
    // one step out, so the frame the grouping draws around the two nodes has
    // room above and beside them
    await page.locator('span[aria-label="Zoom Out"] button').first().click()
    await page.waitForTimeout(1500)

    const box = id => page.evaluate(nodeId =>
      document.querySelector(`.react-flow__node[data-id="${nodeId}"]`).getBoundingClientRect().toJSON(), id)
    /** The title of one node, where a click selects it. */
    const title = async id => {
      const r = await box(id)
      return { x: Math.round(r.x + 55), y: Math.round(r.y + r.height / 2) }
    }

    const CONNECT = 'NwVdNSavuqU'
    const MONITOR = 'Oh18Naa0W6s'
    const group = page.locator('span[aria-label*="Group"] button, button[aria-label*="Group"]').first()

    // the frame the grouping draws is laid out by the board, so the clip has
    // to hold the whole flowboard pane
    await m.focus({ x: 252, y: 40, width: 1006, height: 880 }, 0)
    await m.cursorAt([600, 300])
    // let the Zoom Out tooltip fade before the first frame
    await page.waitForTimeout(1200)
    await m.hold(1200)

    await m.click(await title(CONNECT), { steps: 12 })
    await m.hold(700)

    await page.keyboard.down('Control')
    await m.click(await title(MONITOR), { steps: 14 })
    await page.keyboard.up('Control')
    await m.hold(1100)

    // the toolbar's group icon now reads "Group 2 selected functions"
    await m.moveTo(group, { steps: 16 })
    await m.hold(1300)
    await m.click()
    // hold() captures the frame and only THEN waits, so the frames that show
    // the finished frame have to be taken after a real wait
    await page.waitForTimeout(900)
    await m.hold(600)
    // off the toolbar, so the clip ends on the frame and not on a tooltip
    await m.moveTo([1180, 860], { steps: 10 })
    await page.waitForTimeout(700)
    await m.hold(3400)
  }
}
