// Putting an executor on the board: a function is dragged out of the
// Functions explorer and dropped on the Flowboard, where it becomes a node.
//
// Recorded on the "Docs: Flowboard and pages" app, with the explorer opened
// at Utilities > Data Processing before the first frame, so the clip is the
// drag alone. The board is zoomed out one step to leave a free band between
// the two OPC UA nodes for the drop.
//
// Delete the combine executor again before re-recording.
module.exports = {
  name: 'drop-a-function-on-the-board',
  description: 'Dragging a function from the Functions explorer onto the Flowboard (GIF)',
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
    await page.waitForTimeout(2200)
    await page.locator('span[aria-label="Zoom Out"] button').first().click()
    await page.waitForTimeout(1200)

    await page.locator('li').filter({ hasText: /^Utilities$/ }).first().click()
    await page.waitForTimeout(1200)
    await page.locator('li').filter({ hasText: /^Data Processing$/ }).first().click()
    await page.waitForTimeout(1800)

    const combine = page.locator('div[draggable="true"]').filter({ hasText: /^combine$/ }).first()

    await m.focus({ x: 20, y: 40, width: 1160, height: 600 }, 0)
    await m.cursorAt([420, 520])
    await m.hold(1200)

    await m.moveTo(combine, { steps: 12 })
    await m.hold(800)
    await m.dragTo({ x: 480, y: 330 }, { steps: 26, delay: 70, settle: 900 })

    // the node only appears after the drop settles, and hold() captures
    // before it waits
    await page.waitForTimeout(1200)
    await m.hold(700)
    await page.waitForTimeout(600)
    await m.hold(3200)
  }
}
