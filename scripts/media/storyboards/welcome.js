// The pictures of the Welcome page (README.md), recorded from the running
// platform so a later release re-shoots them instead of someone redrawing a
// picture nobody has the source of.
//
// All of them come from "Line 2 monitor", the App written for exactly this:
// three simulated machines (SignalSimulator instances filler, capper and
// labeler) whose values a modifier shapes for the page, and three widgets
// linked to them. One App carries every idea the Welcome page claims, so the
// reader meets the same screen in each figure.
//
//   welcome-classes-instances  one class, three machines
//   welcome-see-and-change     the executor opened up, its expression on top
//   welcome-triggers           the same executor's trigger, alone
//   welcome-widget-links       a widget's settings, showing the value it gets
//
// The recipe for a node figure is the one concept-nodes.js uses: select the
// nodes, press F (the board fits the SELECTION), hide every other node and
// edge with a stylesheet, deselect, then crop to the union of the boxes.
// Hiding is what keeps a neighbour out of the frame without moving anyone.
//
// The App must RUN for the last figure: "Live value" in a widget's settings is
// what the running backend sends. Start it with the Builder's Test (or
// `test_app`) before recording, and stop it afterwards.
//
// The figures are shot at twice the pixel density (node labels are ~12 px), so
// README.md references each PNG at HALF its pixel width.
const APP = { domain: 'acme.default', appId: 'qq2gv', appName: 'Line 2 monitor' }

const EXEC = 'Cfl2Jwai3zQ'        // SignalSimulator.getValues on "filler"
const SHAPER = 'VXC9umHasjo'      // its modifier: picks and rounds for the page
// The three modifiers that each feed one widget, and the badge the board
// draws under each of them for the widget it is linked to. They already sit
// in a column, so fitting the middle one brings all three into the frame.
const LINKS = [
  'Hy0Kg3UjksM',                  // x.parts   -> Value Box
  '5NePLKJH1eU',                  // x.load    -> Circular Gauge
  'aQWQQZdm18I'                   // x.state   -> Status Lamp
]

// One class, three machines: the constructors that make the instances. The
// Functions explorer would say the same, but its Signal Simulator carries
// every instance in the workspace - including those of other demo Apps - so
// the board, where this App's own three stand together, is the honest frame.
// They sit far apart, so the figure stacks them into a column.
const MACHINES = ['G532HYGVXS4', 'OzJHcv9vhCA', 'yAWDtiO8upg']

module.exports = {
  name: 'welcome',
  description: 'The Welcome page figures: instances, an open executor, a trigger, a widget link (PNGs)',
  login: true,
  // wide enough that the executor and its modifier still fit at the fit
  // view's maximum zoom, and that the board's toolbar clears the nodes
  viewport: { width: 1920, height: 1080 },
  scale: 2,

  async run ({ page, m, env }) {
    const q = new URLSearchParams(APP)
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(1000)

    const step = s => console.log(`  . ${s}`)

    /** What is still open over the board. */
    const panes = () => page.evaluate(() => ({
      explorer: [...document.querySelectorAll('.MuiTreeItem-label')].some(e => e.getBoundingClientRect().height > 0),
      console: !!document.querySelector('[aria-label="Close Console"]'),
      pageEditor: [...document.querySelectorAll('[id]')]
        .some(e => /^[A-Za-z0-9_-]{11}$/.test(e.id) && e.getBoundingClientRect().width > 0)
    }))

    /**
     * Closes the panes one by one and checks afterwards: right after a load
     * a click can land before the pane is listening, and a figure recorded
     * with the explorer still open is the picture of a different thing.
     */
    const ensureBare = async () => {
      const shut = { explorer: 'Toggle Explorer', console: 'Close Console', pageEditor: 'Toggle Page editor' }
      for (let i = 0; i < 5; i++) {
        const open = await panes()
        const left = Object.keys(shut).filter(k => open[k])
        if (!left.length) return
        for (const k of left) {
          const button = page.locator(`[aria-label="${shut[k]}"]`)
          if (await button.count()) {
            await button.first().click()
            await page.waitForTimeout(700)
          }
        }
      }
      throw new Error(`panes will not close: ${JSON.stringify(await panes())}`)
    }

    /** The board alone: no Console, no Page editor, no explorer, no mini map. */
    const bareBoard = async () => {
      const hide = page.locator('[aria-label="Hide mini map"]')
      if (await hide.count()) {
        await hide.first().click()
        await page.waitForTimeout(400)
      }
      await ensureBare()
      // The board's floating toolbars sit over the top left of the canvas.
      // Whatever the fit view puts there - here the three constructors - they
      // swallow its clicks and would bleed into its crop. The board is fitted
      // with the F key, so nothing below needs them.
      await page.evaluate(() => {
        document.getElementById('hw-no-panels')?.remove()
        const style = document.createElement('style')
        style.id = 'hw-no-panels'
        // only the board's own toolbars: the Page editor is a panel too
        style.textContent = '[data-testid="flowboard-panel"] { display: none !important; }'
        document.head.appendChild(style)
      })
      await page.waitForTimeout(300)
    }
    await bareBoard()

    const node = id => page.locator(`.react-flow__node[data-id="${id}"]`)

    /** Hides every node and edge that does not belong to this figure. */
    const onlyShow = ids => page.evaluate(wanted => {
      document.getElementById('hw-figure-mask')?.remove()
      const style = document.createElement('style')
      style.id = 'hw-figure-mask'
      const keeps = wanted.map(w => `[data-id*="${w}"]`).join(',')
      const edges = wanted.map(w => `[aria-label*="${w}"]`).join(',')
      style.textContent =
        `.react-flow__node:not(${keeps}) { visibility: hidden !important; }` +
        `.react-flow__edge:not(${edges}) { visibility: hidden !important; }`
      document.head.appendChild(style)
    }, ids)

    const unmask = () => page.evaluate(() => {
      document.getElementById('hw-figure-mask')?.remove()
      document.getElementById('hw-no-badges')?.remove()
    })

    /** Hides the trigger badges the board draws above its nodes. */
    const hideBadges = () => page.evaluate(() => {
      document.getElementById('hw-no-badges')?.remove()
      const style = document.createElement('style')
      style.id = 'hw-no-badges'
      style.textContent = '.react-flow__node[data-id^="widget-trg-"] { visibility: hidden !important; }'
      document.head.appendChild(style)
    })

    /** Selects `ids` and lets the board fit them. */
    const fitTo = async ids => {
      await page.mouse.click(960, 1040)
      await page.keyboard.press('f')
      await page.waitForTimeout(1200)
      for (const [i, id] of ids.entries()) {
        await node(id).click({ position: { x: 4, y: 4 }, modifiers: i ? ['Control'] : [] })
        await page.waitForTimeout(250)
      }
      await page.keyboard.press('f')
      await page.waitForTimeout(1600)
    }

    /** Lays nodes in a column at (x, y); nothing moves on the board itself. */
    const stackColumn = (ids, x, y, gap) => page.evaluate(([wanted, x0, y0, g]) => {
      const viewport = document.querySelector('.react-flow__viewport')
      const zoom = new DOMMatrixReadOnly(getComputedStyle(viewport).transform).a
      const boxes = []
      let top = y0
      for (const id of wanted) {
        const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        if (!el) continue
        const box = el.getBoundingClientRect()
        el.style.transform = `${el.style.transform} translate(${(x0 - box.x) / zoom}px, ${(top - box.y) / zoom}px)`
        boxes.push({ x: x0, y: top, width: box.width, height: box.height })
        top += box.height + g
      }
      return boxes
    }, [ids, x, y, gap])

    /**
     * Every box the board still draws after the mask: the nodes of the figure,
     * their badges, and the group frames drawn around them. Cropping to the
     * nodes alone cuts those frames in half.
     */
    const visibleBoxes = () => page.evaluate(() => [...document.querySelectorAll('.react-flow__node')]
      .filter(e => getComputedStyle(e).visibility !== 'hidden')
      .map(e => e.getBoundingClientRect().toJSON())
      .filter(r => r.width > 0 && r.height > 0))

    /** Every box the board draws for `ids`: the node, its trigger badge. */
    const partsOf = ids => page.evaluate(wanted => [...document.querySelectorAll('.react-flow__node')]
      .filter(e => wanted.some(w => (e.getAttribute('data-id') || '').includes(w)))
      .map(e => e.getBoundingClientRect().toJSON())
      .filter(r => r.width > 0), ids)

    const union = boxes => {
      const b = boxes.filter(Boolean)
      if (!b.length) throw new Error('nothing to crop to')
      const x = Math.min(...b.map(r => r.x))
      const y = Math.min(...b.map(r => r.y))
      return {
        x,
        y,
        width: Math.max(...b.map(r => r.x + r.width)) - x,
        height: Math.max(...b.map(r => r.y + r.height)) - y
      }
    }

    const FLOATING = '.MuiPopover-paper, .MuiMenu-paper, .MuiPopper-root, [role="menu"], [role="tooltip"]'
    const FLOATING_SEL = FLOATING

    const floating = () => page.evaluate(sel => [...document.querySelectorAll(sel)]
      .map(e => e.getBoundingClientRect().toJSON())
      .filter(r => r.width > 20 && r.height > 20), FLOATING)

    /** The expression chip: the node's one button that carries text and no
     *  label of its own. */
    const chipOf = id => page.evaluate(wanted => {
      const el = document.querySelector(`.react-flow__node[data-id="${wanted}"]`)
      if (!el) return null
      const b = [...el.querySelectorAll('button')]
        .map(e => ({ aria: e.getAttribute('aria-label'), txt: (e.innerText || '').trim(), r: e.getBoundingClientRect().toJSON() }))
        .find(o => !o.aria && o.txt)
      return b ? b.r : null
    }, id)

    /** An expression editor closes only by its own x. */
    const closeFloating = async () => {
      for (let i = 0; i < 6; i++) {
        const closed = await page.evaluate(sel => {
          let n = 0
          for (const e of document.querySelectorAll(sel)) {
            const r = e.getBoundingClientRect()
            if (r.width < 20 || r.height < 20) continue
            const x = [...e.querySelectorAll('button')]
              .find(b => b.querySelector('svg[data-testid="CloseIcon"]'))
            if (x) { x.click(); n++ }
          }
          return n
        }, FLOATING)
        if (!closed) break
        await page.waitForTimeout(350)
      }
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }

    // --- 1. one class, three machines -------------------------------------
    step('one class, three machines')
    await fitTo([MACHINES[0]])
    await onlyShow(MACHINES)
    await hideBadges()
    const machineBoxes = await stackColumn(MACHINES, 170, 150, 30)
    await page.mouse.click(40, 1040)
    await page.waitForTimeout(500)
    await m.focus(union(machineBoxes), 26)
    await m.still('welcome-classes-instances')
    m.unfocus()

    // the stack moved nodes in the page; a reload puts the board back
    await unmask()
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    if (await notNow.count()) await notNow.first().click()
    await bareBoard()

    // --- 2. the executor opened up ----------------------------------------
    // The executor, the modifier that shapes its result, and that modifier's
    // expression on top: what "nothing is hidden" means, in one frame.
    step('the executor opened up')
    await unmask()
    await fitTo([EXEC, SHAPER])
    await onlyShow([EXEC, SHAPER])
    await page.mouse.click(40, 1040)
    await page.waitForTimeout(400)
    const chip = await chipOf(SHAPER)
    if (chip) {
      await page.mouse.click(chip.x + chip.width / 2, chip.y + chip.height / 2)
      await page.waitForTimeout(1300)
    }
    // the one floating card that carries this expression - not the board's
    // toolbars, tooltips and menus, which the generic selector also matches
    const editor = await page.evaluate(sel => [...document.querySelectorAll(sel)]
      .filter(e => /line overview/.test(e.innerText || ''))
      .map(e => e.getBoundingClientRect().toJSON())
      .filter(r => r.width > 60 && r.height > 40), FLOATING_SEL)
    await page.mouse.move(60, 1040)
    await page.waitForTimeout(400)
    await m.focus(union([...(await visibleBoxes()), ...editor]), 30)
    await m.still('welcome-see-and-change')
    m.unfocus()
    await closeFloating()

    // --- 3. the trigger, alone --------------------------------------------
    // The badge the board draws above the node is the trigger, so the crop
    // takes every box the board draws for this executor, not just its own.
    step('the trigger')
    await unmask()
    await fitTo([EXEC])
    await onlyShow([EXEC])
    await page.mouse.click(40, 1040)
    await page.waitForTimeout(500)
    await m.focus(union(await visibleBoxes()), 20)
    await m.still('welcome-triggers')
    m.unfocus()
    await unmask()

    // --- 4. the link from a value to a widget -----------------------------
    // Each modifier picks one value out of the reading and carries, under it,
    // the badge of the widget it feeds. That badge IS the link the section
    // talks about, so the figure is the three of them side by side: a number,
    // a gauge and a lamp, each wired to the value it shows.
    step('the links to the widgets')
    await unmask()
    await fitTo([LINKS[1]])
    await onlyShow(LINKS)
    await page.mouse.click(40, 1040)
    await page.waitForTimeout(500)
    await m.focus(union(await visibleBoxes()), 26)
    await m.still('welcome-widget-links')
    m.unfocus()
    await unmask()
  }
}
