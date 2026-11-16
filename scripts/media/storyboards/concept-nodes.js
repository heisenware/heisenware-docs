// The executor nodes the concept pages and two labs point at, photographed
// one figure at a time on the "Docs: concepts and labs" App.
//
// The recipe for a node figure: select the nodes of the figure, press F
// (the board fits the SELECTION, boardControls.js FIT_VIEW), hide every
// other node and edge with a stylesheet, deselect, then crop to the union
// of the boxes. Hiding is what keeps a neighbour out of the frame without
// moving anyone on the board.
//
// One figure shows three nodes the board keeps far apart (the three
// address shapes). `stack: true` lays them in a column for the shot by
// translating them in the page, which changes nothing on the board: the
// nodes keep the positions the member gave them.
const APP = { appId: '7vg2d', name: 'Docs: concepts and labs' }

/** The figures, each a list of executor ids in the order they are selected. */
const FIGURES = [
  // concepts/executors-and-instances.md
  { asset: 'concept-executor-anatomy', ids: ['LTOiHvhwFaM'] },      // Tools.mergeObjects
  { asset: 'concept-yaml-default', ids: ['5i5S4Foyvzg'] },          // Simulator.randomInteger
  // concepts/backend-events.md
  { asset: 'concept-event-outputs', ids: ['bJQHdeBa4Os'] },         // SignalSimulator.onTick
  // concepts/when-streams-meet.md
  { asset: 'concept-streams-meet', ids: ['LtXgvgceObs', 'Q7QyxGfv5PY', 'zHKIoJhSaxY'] },
  // labs/connect-an-external-mqtt-client.md
  { asset: 'lab-mqtt-event-outputs', ids: ['nKrd8cUZaYY'] },        // MqttClient.onJsonMessage
  // concepts/executors-and-instances.md: a static function, an instance
  // function, and one on an agent of its own - stacked into one figure
  {
    asset: 'concept-addresses',
    ids: ['Qh5TVfNeraY', 'oCO99cKsEwU', 'za22w02Z9v0'],
    fit: ['Qh5TVfNeraY'],
    stack: true
  }
]

module.exports = {
  name: 'concept-nodes',
  description: 'Executor nodes for the concept pages and the MQTT lab (PNGs)',
  login: true,
  // wide enough that a three-node figure still fits at the fit view's
  // maximum zoom of 1.2
  viewport: { width: 1920, height: 1080 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({ domain: 'acme.default', appId: APP.appId, appName: APP.name })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1200)

    // the board alone: no assistant panel, no page editor, no explorer,
    // no mini map - and no bottom bar with its email address in the frame
    for (const label of ['Close Console', 'Toggle Page editor', 'Toggle Explorer', 'Hide mini map']) {
      const button = page.locator(`[aria-label="${label}"]`)
      if (await button.count()) {
        await button.first().click()
        await page.waitForTimeout(500)
      }
    }

    const node = id => page.locator(`.react-flow__node[data-id="${id}"]`)

    /**
     * Hides every node and edge that does not belong to this figure. The
     * trigger badges above a node carry its id too (widget-trg-<id>-...),
     * and an edge names both of its ends in its aria-label.
     */
    const onlyShow = ids => page.evaluate(wanted => {
      const id = 'hw-figure-mask'
      document.getElementById(id)?.remove()
      const style = document.createElement('style')
      style.id = id
      const keeps = wanted.map(w => `[data-id*="${w}"]`).join(',')
      const edges = wanted.map(w => `[aria-label*="${w}"]`).join(',')
      style.textContent =
        `.react-flow__node:not(${keeps}) { visibility: hidden !important; }` +
        `.react-flow__edge:not(${edges}) { visibility: hidden !important; }`
      document.head.appendChild(style)
    }, ids)

    const unmask = () => page.evaluate(() => document.getElementById('hw-figure-mask')?.remove())

    /**
     * Lays the nodes in a column at (x, y) on the screen, by appending a
     * translate to the one React Flow wrote. The translate is in flow
     * units, so the screen distance is divided by the viewport's zoom.
     * Returns the boxes the nodes now occupy.
     */
    const stackColumn = (ids, x, y, gap) => page.evaluate(([wanted, x0, y0, g]) => {
      const viewport = document.querySelector('.react-flow__viewport')
      const zoom = new DOMMatrixReadOnly(getComputedStyle(viewport).transform).a
      const boxes = []
      let top = y0
      for (const id of wanted) {
        const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        const box = el.getBoundingClientRect()
        el.style.transform = `${el.style.transform} translate(${(x0 - box.x) / zoom}px, ${(top - box.y) / zoom}px)`
        boxes.push({ x: x0, y: top, width: box.width, height: box.height })
        top += box.height + g
      }
      return boxes
    }, [ids, x, y, gap])

    for (const { asset, ids, fit, stack } of FIGURES) {
      await unmask()
      // deselect, fit the whole board, then select this figure and fit again
      await page.mouse.click(960, 1000)
      await page.keyboard.press('f')
      await page.waitForTimeout(1200)
      for (const [i, id] of (fit ?? ids).entries()) {
        await node(id).click({ position: { x: 4, y: 4 }, modifiers: i ? ['Control'] : [] })
        await page.waitForTimeout(250)
      }
      await page.keyboard.press('f')
      await page.waitForTimeout(1600)

      let boxes = []
      for (const id of ids) boxes.push(await node(id).boundingBox())
      await onlyShow(ids)
      if (stack) boxes = await stackColumn(ids, 120, 120, 28)
      // the selection ring is Builder state, not part of the figure
      await page.mouse.click(40, 1040)
      await page.waitForTimeout(500)

      const x0 = Math.min(...boxes.map(b => b.x))
      const y0 = Math.min(...boxes.map(b => b.y))
      const x1 = Math.max(...boxes.map(b => b.x + b.width))
      const y1 = Math.max(...boxes.map(b => b.y + b.height))
      m.unfocus()
      await m.focus({ x: x0, y: y0, width: x1 - x0, height: y1 - y0 }, 22)
      await m.still(asset)
      console.log(`  ${asset}: ${Math.round(x1 - x0)}x${Math.round(y1 - y0)}`)
    }
    await unmask()
  }
}
