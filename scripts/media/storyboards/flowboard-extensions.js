// The Flowboard's extension nodes - modifier, filter, error handler, recorder -
// one still per worked example on app-builder/flowboard/*.md.
//
// It records from the App "Docs: Flowboard extensions" (appId below), which
// carries one executor per example: a `Tools.echo` (or `Tools.combine`,
// `Simulator.*`) holding the page's own input value, with the page's own
// expression on an extension of its return. The executors were invoked once so
// every node shows a real result; the App itself is not started, so the values
// stand still between stills.
//
// Rebuilding that App from scratch: one executor per entry of EXAMPLES below,
// the `exec` id's comment naming the example, the input default = the "Data"
// block of the page, the extension's expression = the "Modifier content" /
// "Filter content" block. The one wire the MCP tools cannot draw is the round
// robin's feedback edge (an executor may not connect to itself): it is made by
// hand, dragging the modifier's grip onto the combine's second input.
const APP = { domain: 'acme.default', appId: '7tbzc', appName: 'Docs: Flowboard extensions' }

// Each entry: the still's name, the executor node, the extension nodes that
// belong in the picture, and what to open on top of them.
//   editor: extension id whose expression editor is opened (long expressions)
//   result: extension id whose value popup is opened (object / array results)
//   menu:   extension id that is right-clicked for its context menu
//   only:   'ext' crops to the extension nodes alone, without their executor
//   grow:   extra room on a side, for what the board draws outside the nodes
const EXAMPLES = [
  // --- modifier.md -------------------------------------------------------
  { name: 'modifier-node', exec: 'D5CnzQymZFI', exts: ['qFPED1Kqapc'], menu: 'qFPED1Kqapc', only: 'ext' },
  { name: 'modifier-jsonata-path', exec: 'vSPZtchno2A', exts: ['7o55K1tYaAg'], editor: '7o55K1tYaAg' },
  { name: 'modifier-jsonata-wrap', exec: 'fTfgXwEaxYk', exts: ['sq9kE5hjQSQ'], editor: 'sq9kE5hjQSQ', result: 'sq9kE5hjQSQ' },
  { name: 'modifier-jsonata-uppercase', exec: 'hB9XJRrEwGY', exts: ['3uVbkbnpaI4'] },
  { name: 'modifier-jsonata-array-filter', exec: 'x4oMwpBgt6g', exts: ['JjsVCz6PnCk'], result: 'JjsVCz6PnCk' },
  { name: 'modifier-ternary', exec: 'mHpah6VPCiM', exts: ['VMPZQl3ea10'], editor: 'VMPZQl3ea10' },
  { name: 'modifier-map-enrich', exec: 'eGsmD8umBsM', exts: ['34UreCkC4B4'], editor: '34UreCkC4B4', result: '34UreCkC4B4' },
  { name: 'modifier-iife', exec: 'jDATtx9STeU', exts: ['hGEnEL93hgE'], editor: 'hGEnEL93hgE' },
  { name: 'modifier-spread', exec: 'GnT2CwDKehw', exts: ['dPYnOTmKaL8'], editor: 'dPYnOTmKaL8', result: 'dPYnOTmKaL8' },
  { name: 'modifier-combine', exec: 'EcXDSoYxeKU', exts: ['3pymr4D97lI'], editor: '3pymr4D97lI', result: '3pymr4D97lI' },
  { name: 'modifier-luxon-dates', exec: 'aXRLDcYQx3k', exts: ['T8fwEsZYRGA'], editor: 'T8fwEsZYRGA', result: 'T8fwEsZYRGA' },
  { name: 'modifier-round-robin', exec: 'ccN9ZlWmIGQ', exts: ['Bb89S2UxMk0'], editor: 'Bb89S2UxMk0' },
  // --- filter.md ---------------------------------------------------------
  { name: 'filter-node', exec: 'myXB1nx4MYo', exts: ['zAwpi98uXeQ'] },
  { name: 'filter-pass-and-block', exec: 'ElmWmN8oVWg', exts: ['zw0NO1EB00U', 'Ir0KSieL5bw'] },
  // the polling source draws its own clock above the executor
  { name: 'filter-runs-an-executor', exec: 'yf5yWLvKHZ0', exts: ['AefztaXP2BY'], also: ['heY9Z2vTOaE'], grow: { top: 70 } },
  { name: 'filter-threshold', exec: 'rRpB3Le5zwk', exts: ['9osTYrsLjb8'] },
  { name: 'filter-keyword', exec: 'ImD2YFaNl3E', exts: ['sybRf4mJJMU'] },
  { name: 'filter-empty-array', exec: 'Bws2PsLaOLM', exts: ['THaO1cmaFpk'] },
  // --- error-handler.md / recorder.md ------------------------------------
  { name: 'error-handler-node', exec: 'bYRR1ZahrUk', exts: ['7R1FSre200Q', 'aPCa7qmM9fw'], result: '7R1FSre200Q' },
  { name: 'recorder-node', exec: 'g20nRFsF6tQ', exts: ['fkzObOGMiEg'], menu: 'fkzObOGMiEg', only: 'ext' }
]

const DEBUG = !!process.env.HW_DEBUG

module.exports = {
  name: 'flowboard-extensions',
  description: 'Flowboard extension nodes: modifier, filter, error handler, recorder (PNGs)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    await page.goto(`${env.baseUrl}/builder?${new URLSearchParams(APP)}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(12000)

    // Everything but the board: the explorer, the console and the page editor
    // take two thirds of the window, and the board is the whole subject here.
    for (const name of ['Toggle Explorer', 'Toggle Console', 'Toggle Page editor']) {
      const b = page.getByRole('button', { name }).first()
      if (await b.count()) { await b.click(); await page.waitForTimeout(500) }
    }
    await page.waitForTimeout(1500)
    // The minimap sits in the bottom-right corner and lands in wide crops.
    const mini = page.locator('.react-flow__minimap')
    if (await mini.count()) {
      const b = await mini.boundingBox()
      await page.mouse.click(b.x + b.width - 12, b.y + 12)
      await page.waitForTimeout(600)
    }

    const pane = await page.locator('.react-flow__pane').boundingBox()
    const park = [pane.x + pane.width - 340, pane.y + pane.height / 2]
    const node = id => page.locator(`.react-flow__node[data-id="${id}"]`)

    /** Pans the board (wheel = pan, half a pixel per unit) until the node's
     *  top-left corner sits at (sx, sy) on screen. */
    const bring = async (id, sx, sy) => {
      for (let i = 0; i < 16; i++) {
        const b = await node(id).boundingBox()
        const dy = sy - b.y
        const dx = sx - b.x
        if (Math.abs(dy) < 3 && Math.abs(dx) < 3) break
        await page.mouse.move(park[0], park[1])
        if (Math.abs(dy) >= 3) await page.mouse.wheel(0, clamp(-2 * dy))
        if (Math.abs(dx) >= 3) {
          await page.keyboard.down('Shift')
          await page.mouse.wheel(0, clamp(-2 * dx))
          await page.keyboard.up('Shift')
        }
        await page.waitForTimeout(220)
      }
    }
    const clamp = v => Math.max(-900, Math.min(900, v))

    /** The buttons of a node, with their labels - the chips are buttons. */
    const buttonsOf = id => page.evaluate(nid => {
      const n = document.querySelector(`.react-flow__node[data-id="${nid}"]`)
      if (!n) return []
      return [...n.querySelectorAll('button')].map(b => ({
        aria: b.getAttribute('aria-label'),
        txt: (b.textContent || '').trim(),
        r: b.getBoundingClientRect().toJSON()
      }))
    }, id)

    /** A node's box plus everything it paints outside it: an extension's
     *  rounded frame is wider and taller than the node React Flow places. */
    const visualBox = id => page.evaluate(nid => {
      const n = document.querySelector(`.react-flow__node[data-id="${nid}"]`)
      if (!n) return null
      let x = Infinity; let y = Infinity; let r = -Infinity; let b = -Infinity
      for (const e of [n, ...n.querySelectorAll('*')]) {
        const box = e.getBoundingClientRect()
        if (!box.width || !box.height) continue
        x = Math.min(x, box.x); y = Math.min(y, box.y)
        r = Math.max(r, box.right); b = Math.max(b, box.bottom)
      }
      return { x, y, width: r - x, height: b - y }
    }, id)

    const clickBox = async box => {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await page.waitForTimeout(900)
    }

    /** The expression chip: the one button of the node that carries text and
     *  no label of its own. */
    const openEditor = async id => {
      const chip = (await buttonsOf(id)).find(b => !b.aria && b.txt)
      if (chip) await clickBox(chip.r)
    }

    /** The value under the chip, when it is a foldable object or array. The
     *  card opens with every branch folded; a picture of `0: {...}` says
     *  nothing, so every node of the tree is opened. */
    const openResult = async id => {
      const btns = await buttonsOf(id)
      const val = btns.filter(b => !b.aria && /^[[{]/.test(b.txt)).pop()
      if (!val) return
      await clickBox(val.r)
      for (let i = 0; i < 6; i++) {
        const opened = await page.evaluate(() => {
          const icons = [...document.querySelectorAll('.react-json-view .collapsed-icon')]
          for (const icon of icons) {
            const click = icon.closest('span[style*="cursor"]')
            if (click) click.click()
          }
          return icons.length
        })
        if (!opened) break
        await page.waitForTimeout(350)
      }
    }

    const FLOATING = '.MuiPopover-paper, .MuiMenu-paper, .MuiPopper-root, [role="menu"], [role="tooltip"]'

    /** Everything floating over the board: editors, value popups, menus. */
    const floating = () => page.evaluate(sel => {
      return [...document.querySelectorAll(sel)]
        .filter(e => {
          const r = e.getBoundingClientRect()
          return r.width > 20 && r.height > 20
        })
        .map(e => e.getBoundingClientRect().toJSON())
    }, FLOATING)

    /** The expression editor and the value card stay open until their own x is
     *  clicked - neither Escape nor a click on the board closes them, and a
     *  leftover card drifts into the next still. */
    const closeFloating = async () => {
      for (let i = 0; i < 6; i++) {
        const left = await page.evaluate(sel => {
          let closed = 0
          for (const e of document.querySelectorAll(sel)) {
            const r = e.getBoundingClientRect()
            if (r.width < 20 || r.height < 20) continue
            const btns = [...e.querySelectorAll('button')]
            const x = btns.find(b => b.querySelector('svg[data-testid="CloseIcon"]'))
            if (x) { x.click(); closed++ }
          }
          return closed
        }, FLOATING)
        if (!left) break
        await page.waitForTimeout(350)
      }
      await page.keyboard.press('Escape')
      await page.waitForTimeout(250)
      await page.mouse.click(park[0], park[1])
      await page.waitForTimeout(350)
    }

    const union = boxes => {
      const b = boxes.filter(Boolean)
      const x = Math.min(...b.map(r => r.x))
      const y = Math.min(...b.map(r => r.y))
      return {
        x,
        y,
        width: Math.max(...b.map(r => r.x + r.width)) - x,
        height: Math.max(...b.map(r => r.y + r.height)) - y
      }
    }

    /** Keeps the crop on the board: never the toolbar above it, never the
     *  status bar below - that one carries an e-mail address. */
    const clampToPane = box => {
      const x = Math.max(pane.x + 2, box.x)
      const y = Math.max(pane.y + 2, box.y)
      return {
        x,
        y,
        width: Math.min(pane.x + pane.width - 2, box.x + box.width) - x,
        height: Math.min(pane.y + pane.height - 2, box.y + box.height) - y
      }
    }

    for (const ex of EXAMPLES) {
      await closeFloating()
      await bring(ex.exec, 70, 300)
      if (DEBUG) {
        for (const id of [ex.exec, ...ex.exts]) {
          console.log(`  [${ex.name}] ${id}:`, JSON.stringify((await buttonsOf(id)).map(b => [b.aria, b.txt.slice(0, 28)])))
        }
      }
      if (ex.editor) await openEditor(ex.editor)
      if (ex.result) await openResult(ex.result)
      if (ex.menu) {
        const b = await node(ex.menu).boundingBox()
        await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2, { button: 'right' })
        await page.waitForTimeout(900)
      }

      const ids = ex.only === 'ext' ? [...ex.exts] : [ex.exec, ...ex.exts, ...(ex.also || [])]
      const boxes = []
      for (const id of ids) boxes.push(await visualBox(id))
      const core = union(boxes)
      // a card belongs in the picture when it sits on the nodes it came from
      const near = r =>
        r.x < core.x + core.width + 360 && r.x + r.width > core.x - 360 &&
        r.y < core.y + core.height + 360 && r.y + r.height > core.y - 360
      boxes.push(...(await floating()).filter(near))
      const box = union(boxes)
      const pad = 18
      const grow = ex.grow || {}
      await m.focus(clampToPane({
        x: box.x - pad - (grow.left || 0),
        y: box.y - pad - (grow.top || 0),
        width: box.width + 2 * pad + (grow.left || 0) + (grow.right || 0),
        height: box.height + 2 * pad + (grow.top || 0) + (grow.bottom || 0)
      }), 0)
      await m.still(ex.name)
      m.unfocus()
    }
    await closeFloating()
  }
}
