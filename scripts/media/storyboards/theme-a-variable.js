// The Theme editor's one gesture: change a base variable, watch the preview
// follow, then Apply, which compiles the theme and hands it to the App.
//
// The corner radius is the variable to show: every field, button and row in
// the preview changes shape, which reads in a small picture, and it is a
// plain text field, unlike the colour boxes.
//
// Recorded on the "Docs: manager" app. Re-running it moves the radius back
// and forth between 4px and 16px, so the clip is the same either way.
module.exports = {
  name: 'theme-a-variable',
  description: 'Changing a theme variable and applying it to the App (GIF)',
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
    await page.waitForTimeout(600)

    await page.getByRole('button', { name: 'Theme editor' }).first().click()
    await page.waitForTimeout(5000)

    // the editor's controls live in the theme-builder iframe; the preview is
    // a second one beside it
    const tb = page.frames().find(f => f.url().includes('/theme-builder/master'))
    if (!tb) throw new Error('the theme editor frame is not there')
    // Border radius is the last plain text field of the variable column
    const field = tb.locator('input.dx-texteditor-input').last()
    const box = await field.boundingBox()
    if (!box) throw new Error('no border radius field in the theme editor')
    const was = await field.inputValue()
    const next = was.startsWith('16') ? '4px' : '16px'

    // The lower half of the editor: the variables that fit beside the Apply
    // button, and the preview's grid. The form above holds a demo e-mail
    // address and the footer the member's own, so both stay out of frame.
    await m.focus({ x: 366, y: 440, width: 1254, height: 470 }, 0)

    await m.cursorAt([700, 860])
    await m.hold(1400)

    // 1. the variable
    await m.moveTo({ x: box.x + box.width / 2, y: box.y + box.height / 2 }, { steps: 16 })
    await m.click()
    await page.keyboard.press('Control+A')
    await m.hold(400)
    await m.type(next, { delay: 110 })
    await page.keyboard.press('Tab')
    // the preview recompiles in the browser and redraws itself; that takes a
    // few seconds, and the clip has to wait it out or it shows nothing
    await m.hold(900)
    await m.hold(900)
    await page.waitForTimeout(2500)
    await m.hold(900)
    await page.waitForTimeout(2500)
    await m.hold(2200)

    // 2. Apply: the theme is compiled and handed to the App; the button
    //    reads "Generating..." while that happens
    const iframe = await page.evaluate(() => {
      const el = [...document.querySelectorAll('iframe')].find(e => /theme-builder/.test(e.src))
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y }
    })
    const applyBox = await tb.evaluate(() => {
      const el = [...document.querySelectorAll('button, [role="button"], .dx-button')]
        .find(e => /^(apply|generating)/i.test((e.innerText || '').trim()))
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    })
    if (!applyBox) throw new Error('no Apply button in the theme editor')
    await m.click({ x: applyBox.x + iframe.x, y: applyBox.y + iframe.y }, { steps: 16 })
    await m.hold(1200)
    await m.hold(1800)
    await m.hold(2600)
  }
}
