// The Functions explorer, opened on the classes the reference pages point at:
// where the ready-made instances (internal-email, internal-mqtt,
// internal-postgres, internal-influx) live in the tree.
module.exports = {
  name: 'function-reference-explorer',
  description: 'Functions explorer: Email, MQTT Client, Relational and Timeseries Database open (PNGs)',
  login: true,
  viewport: { width: 1920, height: 1000 },
  // the tree's labels are 12 px: shoot it at twice the pixel density
  scale: 2,

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '75fdc',
      appName: 'Docs: function reference'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(10000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1200)
    // the assistant drawer covers the lower half of the explorer
    await page.getByRole('button', { name: 'Toggle Console' }).first().click()
    await page.waitForTimeout(1200)

    const collapseAll = page.getByRole('button', { name: 'Collapse All' }).first()

    /** Clicks a row of the tree by its label. */
    const open = async label => {
      const row = page.locator('.MuiTreeItem-label').filter({ hasText: new RegExp(`^${label}$`) }).first()
      await row.waitFor({ state: 'visible', timeout: 10000 })
      await row.click()
      await page.waitForTimeout(900)
    }

    /** Crops to the rows from `first` down to `rows` rows below it. */
    const shot = async (name, first, rows) => {
      const box = await page.evaluate(([label, count]) => {
        const items = [...document.querySelectorAll('.MuiTreeItem-label')]
          .map(e => ({ e, r: e.getBoundingClientRect() }))
          .filter(o => o.r.height > 0)
          .sort((a, b) => a.r.y - b.r.y)
        const start = items.findIndex(o => o.e.textContent.trim().startsWith(label))
        if (start < 0) return null
        const shown = items.slice(start, start + count)
        const x = Math.min(...shown.map(o => o.r.x))
        const y = shown[0].r.y
        const last = shown[shown.length - 1].r
        return {
          x,
          y,
          width: Math.max(...shown.map(o => o.r.right)) - x,
          height: last.bottom - y
        }
      }, [first, rows])
      if (!box) throw new Error(`no tree row "${first}"`)
      await m.focus(box, 10)
      await m.still(name)
      m.unfocus()
    }

    // Connectors > Email: create, delete and the ready-made internal-email
    await collapseAll.click()
    await page.waitForTimeout(600)
    await open('Connectors')
    await open('Email')
    await shot('explorer-email', 'Connectors', 7)

    // Connectors > MQTT Client, with the other connectors above it
    await collapseAll.click()
    await page.waitForTimeout(600)
    await open('Connectors')
    await open('MQTT Client')
    await shot('explorer-mqtt-client', 'Connectors', 17)

    // Storage > Relational Database > internal-postgres, opened on its functions
    await collapseAll.click()
    await page.waitForTimeout(600)
    await open('Storage')
    await open('Relational Database')
    await open('internal-postgres')
    await shot('explorer-relational-database', 'Storage', 11)

    // Storage > Timeseries Database > internal-influx
    await collapseAll.click()
    await page.waitForTimeout(600)
    await open('Storage')
    await open('Timeseries Database')
    await open('internal-influx')
    await shot('explorer-timeseries-database', 'Storage', 11)
  }
}
