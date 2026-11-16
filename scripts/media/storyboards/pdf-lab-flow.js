// The flow of the lab "Automating PDF reports", in three pictures:
//
//   pdf-lab-flow-save.png     the submit becomes a row:
//                             echo -> modifier -> mergeObjects -> addRow
//   pdf-lab-flow-render.png   the row becomes a document:
//                             fillTemplate and the attachment modifier
//   pdf-lab-flow-send.png     the document becomes an email:
//                             send with its error handler
//
// One picture of the whole board cannot be read in a doc column. The text on
// a node is about ten design pixels tall, so a frame of F design pixels
// rendered at an 800 px column shows it 8000/F pixels tall: legible up to
// about 900, a grey diagram past 2000. Each group is framed on its own nodes
// and zoomed to fill the window, and everything is recorded at scale 2 so the
// enlarged picture is sharp as well. `send` alone is some 1300 design pixels
// wide - its row of literal values cannot be made narrower - so that picture
// stays the coarsest of the three; the other two read at a glance.
//
// The App is "Docs: template editor" (ue4vw). Nothing here changes it.
// On this board a plain wheel PANS and Ctrl+wheel ZOOMS, around the pointer.
const APP = { domain: 'acme.default', appId: 'ue4vw', appName: 'Docs: template editor' }

// the three groups, by executor and extension id
const SAVE = ['X9n1TpaaiU8', 'DjrsL5Ag0LE', 'RXPeOBV333A', 'UbWdMbsGiwE']
const RENDER = ['o6zbvJLawFk', 'hujQohnWwag']
const SEND = ['jCdMOaJbrtE', '3txkPJbTobI']

// the window the picture may use: clear of the floating board toolbar
// (it ends at about y 81) and of the Builder's status bar (from y 918)
const AREA = { x: 60, y: 110, width: 1570, height: 760 }

module.exports = {
  name: 'pdf-lab-flow',
  description: 'Automating PDF reports: the flow in two halves, save and send (PNGs)',
  login: true,
  viewport: { width: 1680, height: 950 },
  scale: 2,

  async run ({ page, m, env }) {
    const q = new URLSearchParams(APP)
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(11000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    const closeConsole = page.getByRole('button', { name: 'Close Console' })
    if (await closeConsole.count()) await closeConsole.first().click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Toggle Explorer' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Toggle Page editor' }).click()
    await page.waitForTimeout(1500)

    await page.mouse.click(800, 500)
    await page.keyboard.press('f')
    await page.waitForTimeout(3000)
    const mini = page.getByRole('button', { name: 'Hide mini map' })
    if (await mini.count()) await mini.first().click()
    await page.waitForTimeout(1000)

    /** The box a group of nodes sits in, measured, never guessed. */
    const rect = ids => page.evaluate(list => {
      const rs = list
        .map(id => document.querySelector(`.react-flow__node[data-id="${id}"]`))
        .filter(Boolean)
        .map(el => el.getBoundingClientRect())
      if (!rs.length) return null
      const x = Math.min(...rs.map(r => r.x))
      const y = Math.min(...rs.map(r => r.y))
      return {
        x,
        y,
        width: Math.max(...rs.map(r => r.right)) - x,
        height: Math.max(...rs.map(r => r.bottom)) - y,
        found: rs.length
      }
    }, ids)

    /** Zooms a group until it fills AREA, then pans it into AREA's corner. */
    const frame = async ids => {
      let box = await rect(ids)
      if (!box || box.found !== ids.length) throw new Error(`only ${box ? box.found : 0} of ${ids.length} nodes on this board`)
      await page.keyboard.down('Control')
      let last = 0
      for (let i = 0; i < 24; i++) {
        const fits = box.width <= AREA.width && box.height <= AREA.height
        const roomy = box.width < AREA.width * 0.94 && box.height < AREA.height * 0.94
        const step = !fits ? 1 : roomy ? -1 : 0
        if (step === 0 || (last && step !== last)) break
        last = step
        await page.mouse.move(840, 470)
        await page.mouse.wheel(0, step * 110)
        await page.waitForTimeout(450)
        const next = await rect(ids)
        if (!next || Math.abs(next.width - box.width) < 0.5) break
        box = next
      }
      await page.keyboard.up('Control')

      // the board pans about a quarter of the wheel's delta, so the
      // correction is scaled: otherwise six steps cover a third of the way
      for (let i = 0; i < 14; i++) {
        box = await rect(ids)
        const dx = box.x - AREA.x
        const dy = box.y - AREA.y
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) break
        await page.mouse.move(840, 470)
        await page.mouse.wheel(dx * 3.8, dy * 3.8)
        await page.waitForTimeout(400)
      }
      // the pointer out of the frame, so no node shows its hover state
      await page.mouse.move(1660, 940)
      await page.waitForTimeout(1200)
      return rect(ids)
    }

    for (const [ids, name] of [[SAVE, 'pdf-lab-flow-save'], [RENDER, 'pdf-lab-flow-render'], [SEND, 'pdf-lab-flow-send']]) {
      m.unfocus()
      const box = await frame(ids)
      await m.focus(box, 16)
      await m.still(name)
    }
  }
}
