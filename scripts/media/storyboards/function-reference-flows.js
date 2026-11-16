// The executor cards the function reference points at: one picture per
// function, shot from the "Docs: function reference" App, where every node
// carries the values the page's own example uses.
//
// Each picture is taken by panning the Flowboard until that picture's nodes
// sit below the floating toolbar, then cropping to them. Panning is done with
// the wheel, which moves the canvas by half the delta it is given and -
// unlike a drag - is not capped by the window. The nodes themselves are
// placed by create_executor, which takes a position: the builder's own layout
// spreads a chain of three over two thousand pixels, and dragging a card in
// the Flowboard is not worth the risk (a drag that passes over a node's
// instance pill can rename it).
module.exports = {
  name: 'function-reference-flows',
  description: 'Flowboard cards for email, file I/O, storage and event simulation (PNGs)',
  login: true,
  // wide: the widest picture (the email flow) is close to 2000 px of board
  viewport: { width: 2300, height: 1200 },

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

    // the assistant drawer and the page editor steal two thirds of the board
    for (const label of ['Toggle Console', 'Toggle Page editor', 'Toggle Explorer']) {
      await page.getByRole('button', { name: label }).first().click()
      await page.waitForTimeout(500)
    }
    await page.waitForTimeout(1500)

    const pane = await page.locator('.react-flow__pane').first().boundingBox()
    // a corner of the board that stays empty whatever is centred: the wheel
    // must not land on a node, or the node scrolls its own content
    const rest = { x: pane.x + 60, y: pane.y + pane.height - 60 }

    // Every picture names executors; the widget chips the builder hangs above
    // a node (its trigger's button, the widget feeding an input) and the
    // extension nodes carry the executor's id in theirs, so one prefix match
    // keeps the whole card and its chips in the crop.
    const union = ids => page.evaluate(list => {
      const rects = [...document.querySelectorAll('.react-flow__node[data-id]')]
        .filter(n => list.some(id => n.dataset.id === id || n.dataset.id.includes(`-${id}-`)))
        .map(n => n.getBoundingClientRect())
      if (!rects.length) return null
      const x = Math.min(...rects.map(r => r.x))
      const y = Math.min(...rects.map(r => r.y))
      return {
        x,
        y,
        width: Math.max(...rects.map(r => r.right)) - x,
        height: Math.max(...rects.map(r => r.bottom)) - y,
        found: rects.length
      }
    }, ids)

    /** Pans until the nodes sit at the top of the board, clear of the toolbar. */
    const bring = async (ids, at) => {
      let u = null
      for (let i = 0; i < 16; i++) {
        u = await union(ids)
        if (!u) throw new Error(`none of ${ids.join(', ')} is on the board`)
        const toX = at ? at.x : pane.x + Math.max(40, (pane.width - u.width) / 2)
        // 200 px of air above: the board's floating toolbar hangs over the
        // top of the canvas and must not land in a crop
        const toY = at ? at.y : pane.y + (u.height + 280 < pane.height ? 200 : Math.max(60, (pane.height - u.height) / 2))
        const dx = toX - u.x
        const dy = toY - u.y
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) break
        await page.mouse.move(rest.x, rest.y)
        // the canvas follows half of what the wheel is given, inverted
        await page.mouse.wheel(-2 * dx, -2 * dy)
        await page.waitForTimeout(250)
      }
      return u
    }

    const shot = async (name, ids, padding = 22) => {
      await bring(ids)
      await page.waitForTimeout(500)
      const u = await union(ids)
      await m.focus(u, padding)
      await m.still(name)
      m.unfocus()
    }

    // --- event simulation ------------------------------------------------
    await shot('events-create-instance', ['L3AlWXikQqg'])
    await shot('events-delete-instance', ['2CaorPKDAgM'])
    await shot('events-manual-trigger', ['RzKaJNMayi8', 'afQgOJtnNsw'])
    await shot('events-auto-trigger', ['jriU1iZJ6qM', 'YYNWTOkdJZ0'])
    await shot('events-stop-auto-trigger', ['3i2DSQzp9VE'])
    await shot('events-trigger-callback', ['vjze2mWXdXc'])

    // --- email -----------------------------------------------------------
    await shot('email-send-flow', ['hkja63RvZc8', 'BSTPDbgGkQg', 'nrmGsphwrRM', 'EkjBCvfI8uw'])

    // --- file I/O --------------------------------------------------------
    await shot('file-write-buffers-to-directory', ['gacXi1kXjOs'])
    await shot('file-read-xlsx-from-upload', ['gRULS2gk3PY', 'GJzin9N0Nu4', '99ojaBTzCjo'])

    // --- relational database ---------------------------------------------
    await shot('database-upsert-row-for-user', ['z4Qwb3YuULY'])
  }
}
