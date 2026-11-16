// The Functions explorer's Install Extension form, open but never
// submitted: Install really pulls a container image and starts it as an
// agent of the workspace, so this storyboard only opens the dialog and
// photographs it.
module.exports = {
  name: 'install-extension',
  description: 'The Install Extension form of the Functions explorer (PNG)',
  login: true,
  viewport: { width: 1280, height: 800 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '7vg2d',
      appName: 'Docs: concepts and labs'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1200)

    const close = page.locator('[aria-label="Close Console"]')
    if (await close.count()) {
      await close.first().click()
      await page.waitForTimeout(600)
    }
    // the explorer opens on Functions already - clicking its rail icon
    // again would collapse the panel and take the button with it
    const install = page.locator('[aria-label="Install Extension"]')
    await install.first().click()
    await page.waitForTimeout(2000)

    // the form is a popover hanging off the puzzle-piece button, not a
    // dialog; the other popovers on the screen are the toolbar's menus
    const box = await page.evaluate(() => {
      const papers = [...document.querySelectorAll('.MuiPopover-paper')]
        .map(e => e.getBoundingClientRect())
        .filter(r => r.width > 250)
      return papers.length ? papers[0].toJSON() : null
    })
    if (!box) throw new Error('The Install Extension form did not open')
    await m.focus(box, 14)
    await m.still('install-extension')
  }
}
