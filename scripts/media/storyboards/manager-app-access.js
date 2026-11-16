// An App's page in the App Manager: who may open it, and who does.
//
// Shot on the "Docs: manager" app, which is open to anyone, so its user list
// is one row per DEVICE - a generated name, no address. The storyboard opens
// the deployed App from a few throwaway browsers first, so the table has
// rows to show.
module.exports = {
  name: 'manager-app-access',
  description: 'The App Manager: the Access Settings card and the App users table (PNGs)',
  login: true,
  viewport: { width: 1680, height: 1200 },

  async run ({ page, m, env }) {
    const APP = '970n8'

    // --- the devices -------------------------------------------------------
    // Every fresh browser that opens an open App registers itself under a
    // name of its own. Four of them make a list worth a picture.
    const browser = page.context().browser()
    const devices = [
      {
        // without a user agent of its own the browser says "Chrome Headless",
        // which belongs in no picture
        name: 'Chrome on a PC',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
      },
      {
        name: 'Chrome on a phone',
        ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        viewport: { width: 412, height: 915 }
      },
      {
        name: 'Safari on an iPad',
        ua: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
        viewport: { width: 820, height: 1180 }
      },
      {
        name: 'Edge on a panel',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0',
        viewport: { width: 1280, height: 800 }
      }
    ]
    for (const d of devices) {
      const ctx = await browser.newContext({
        ignoreHTTPSErrors: true,
        userAgent: d.ua,
        viewport: d.viewport
      })
      try {
        const p = await ctx.newPage()
        await p.goto(`${env.baseUrl}/app/acme.default/${APP}`, { waitUntil: 'networkidle', timeout: 60000 })
        await p.waitForTimeout(4000)
      } catch (err) {
        console.warn(`  (${d.name} did not open the app: ${err.message.split('\n')[0]})`)
      } finally {
        await ctx.close()
      }
    }

    // --- the App's page in the manager -------------------------------------
    await page.goto(`${env.baseUrl}/manager/apps?app=${APP}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(4000)

    /** The card a heading belongs to: up the tree until it is card-wide. */
    const box = async text => page.evaluate(t => {
      const el = [...document.querySelectorAll('h2')].find(e => e.innerText.trim() === t)
      if (!el) return null
      let card = el
      while (card.parentElement && card.getBoundingClientRect().width < 560) card = card.parentElement
      const r = card.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    }, text)

    // 1. the Access Settings card. The mode is a NATIVE select, so its open
    //    list is drawn by the operating system and no screenshot can hold it;
    //    the page lists the five modes in prose beside this picture.
    const access = await box('Access Settings')
    if (!access) throw new Error('no Access Settings card on the App page')
    const mode = await page.evaluate(() => {
      const el = [...document.querySelectorAll('select')]
        .find(e => [...e.options].some(o => /anyone can use the app/i.test(o.text)))
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { bottom: r.y + r.height }
    })
    if (!mode) throw new Error('no access mode select on the App page')
    await m.focus({
      x: access.x - 16,
      y: access.y - 16,
      width: access.width + 32,
      height: mode.bottom + 22 - (access.y - 16)
    }, 0)
    await m.still('manager-access-mode')
    m.unfocus()

    // 2. the user list: one row per device in an open App
    const users = await page.evaluate(() => {
      const h = [...document.querySelectorAll('h2')].find(e => e.innerText.trim() === 'App users')
      const t = document.querySelector('table')
      if (!h || !t) return null
      const a = h.getBoundingClientRect()
      const b = t.getBoundingClientRect()
      const rows = [...document.querySelectorAll('table tbody tr')].map(r => r.getBoundingClientRect())
      const bottom = rows.length ? rows[rows.length - 1].bottom : b.bottom
      const x = Math.min(a.x, b.x)
      return { x, y: a.y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: bottom - a.y }
    })
    if (!users) throw new Error('no App users table on the App page')
    await m.focus(users, 16)
    await m.still('manager-app-users')
    m.unfocus()
  }
}
