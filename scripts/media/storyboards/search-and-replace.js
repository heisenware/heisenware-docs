// Search and replace over a selection: the IP address of the oven controller
// moves, and both executors that carry it are corrected in one go.
//
// Recorded on the "Docs: Flowboard and pages" app. Replace is only offered
// with at least two executors selected, which is Ctrl and a click on each.
//
// The address is written back (set_input_default) after the recording, so the
// storyboard can be run again.
//
// The annotation card must be off the board while this is recorded: Fit View
// frames everything on the canvas, and a card off to the side shrinks the two
// nodes to nothing. Delete it, record, and create it again.
module.exports = {
  name: 'search-and-replace',
  description: 'Replacing a string across several selected executors (GIF)',
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
    await page.locator('span[aria-label="Zoom Out"] button').first().click()
    await page.waitForTimeout(1500)

    const title = async id => {
      const r = await page.evaluate(nodeId =>
        document.querySelector(`.react-flow__node[data-id="${nodeId}"]`).getBoundingClientRect().toJSON(), id)
      return { x: Math.round(r.x + 55), y: Math.round(r.y + r.height / 2) }
    }
    const CONNECT = 'NwVdNSavuqU'
    const MONITOR = 'Oh18Naa0W6s'
    const replace = page.locator('span[aria-label*="Replace"] button').first()

    await m.focus({ x: 252, y: 40, width: 1006, height: 880 }, 0)
    await m.cursorAt([600, 300])
    // let the Zoom Out tooltip fade before the first frame
    await page.waitForTimeout(1200)
    await m.hold(1200)

    await m.click(await title(CONNECT), { steps: 8 })
    await m.hold(600)
    await page.keyboard.down('Control')
    await m.click(await title(MONITOR), { steps: 9 })
    await page.keyboard.up('Control')
    await m.hold(1000)

    await m.moveTo(replace, { steps: 9 })
    await m.hold(900)
    await m.click()
    await page.waitForTimeout(1200)
    await m.hold(900)

    const dialog = page.locator('div[aria-labelledby="search-replace-dialog"]')
    await m.click(dialog.locator('input').nth(0), { steps: 8 })
    for (const part of ['192.168.', '10.7']) await m.type(part, { delay: 70, hold: 320 })
    await m.hold(700)
    await m.click(dialog.locator('input').nth(1), { steps: 8 })
    for (const part of ['192.168.', '10.23']) await m.type(part, { delay: 70, hold: 320 })
    await m.hold(900)

    await m.click(dialog.getByRole('button', { name: /replace/i }).last(), { steps: 8 })
    // the board keeps drawing the OLD value until it is reloaded, so the clip
    // ends on the dialog closing - what it shows is the gesture, not a live
    // redraw that does not happen
    await page.waitForTimeout(1400)
    await m.hold(800)
    await page.waitForTimeout(500)
    await m.hold(3000)
  }
}
