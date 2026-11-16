// An annotation card on the Flowboard: the documentation card that says what
// no single node can say - here the architecture of the oven monitor, with a
// mermaid diagram the board draws, and tinted in the colour of the section it
// explains.
//
// The card itself is made with create_annotation on the "Docs: Flowboard and
// pages" app (annotation OiEd4hFaf9I); this storyboard only frames it.
module.exports = {
  name: 'flowboard-annotation',
  description: 'An annotation card on the Flowboard, with a mermaid diagram (PNG)',
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

    const ANNOTATION = 'OiEd4hFaf9I'
    const boxOf = () => page.evaluate(id => {
      const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
      return el ? el.getBoundingClientRect().toJSON() : null
    }, ANNOTATION)

    // Ctrl and the wheel zoom towards the pointer, so keeping the pointer on
    // the card walks the view into it until the card is legible. Fit View
    // frames the whole board even with the card selected, which leaves it at
    // half size.
    let card = await boxOf()
    if (!card) throw new Error('the annotation card is not on the board')
    for (let i = 0; i < 14 && card.width < 640; i++) {
      await page.mouse.move(Math.round(card.x + card.width / 2), Math.round(card.y + card.height / 2))
      await page.keyboard.down('Control')
      await page.mouse.wheel(0, -240)
      await page.keyboard.up('Control')
      await page.waitForTimeout(500)
      card = await boxOf()
    }
    // zooming towards the pointer drifts, so the card is walked back into the
    // middle of the pane with the wheel (vertical) and Shift + wheel
    // (horizontal). How far one wheel unit moves the board is measured once
    // instead of guessed.
    const pane = await page.locator('.react-flow__pane').boundingBox()
    const target = { x: pane.x + pane.width / 2, y: pane.y + pane.height / 2 }
    const centre = b => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 })

    await page.mouse.move(target.x, target.y)
    let before = centre(await boxOf())
    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(500)
    let after = centre(await boxOf())
    const perUnitY = (after.y - before.y) / 120

    await page.keyboard.down('Shift')
    before = after
    await page.mouse.wheel(0, 120)
    await page.keyboard.up('Shift')
    await page.waitForTimeout(500)
    after = centre(await boxOf())
    const perUnitX = (after.x - before.x) / 120

    if (perUnitY) {
      await page.mouse.wheel(0, (target.y - after.y) / perUnitY)
      await page.waitForTimeout(600)
    }
    if (perUnitX) {
      const now = centre(await boxOf())
      await page.keyboard.down('Shift')
      await page.mouse.wheel(0, (target.x - now.x) / perUnitX)
      await page.keyboard.up('Shift')
      await page.waitForTimeout(600)
    }

    await page.mouse.move(pane.x + 30, pane.y + pane.height - 30)
    await page.waitForTimeout(900)

    card = await boxOf()
    console.log('card', JSON.stringify(card))
    await m.still('flowboard-annotation-window')

    await m.focus({ x: card.x, y: card.y, width: card.width, height: card.height }, 14)
    await m.still('flowboard-annotation')
  }
}
