// The App Player's install prompt: a few seconds after the first visit, on a
// browser that offers installation, the App asks by itself.
//
// Headless Chromium never fires `beforeinstallprompt`, so the storyboard
// fires it itself: the Player only waits for that event and for the first
// visit of this browser (UserInterface.jsx, "manage the installation
// banner"), and the toast it then renders is the real one.
module.exports = {
  name: 'player-install-prompt',
  description: "The App Player's install prompt (PNG)",
  login: false,
  viewport: { width: 1280, height: 800 },

  async run ({ page, m, env }) {
    await page.addInitScript(() => {
      // the Player listens on mount; keep firing until it does
      const fire = () => window.dispatchEvent(new Event('beforeinstallprompt'))
      window.addEventListener('load', () => {
        let n = 0
        const t = setInterval(() => { fire(); if (++n > 20) clearInterval(t) }, 250)
      })
    })

    await page.goto(`${env.baseUrl}/app/acme.default/970n8`, { waitUntil: 'networkidle', timeout: 60000 })
    // the Player shows the prompt three seconds after the page settles
    await page.waitForTimeout(9000)

    // nothing may look selected in the picture
    await page.evaluate(() => window.getSelection && window.getSelection().removeAllRanges())
    await page.waitForTimeout(400)

    const toast = await page.evaluate(() => {
      const el = [...document.querySelectorAll('.dx-toast-content')].find(e => e.getBoundingClientRect().width > 50)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    if (!toast) throw new Error('the Player did not show the install prompt')
    await m.focus(toast, 8)
    await m.still('player-install-prompt')
    m.unfocus()
  }
}
