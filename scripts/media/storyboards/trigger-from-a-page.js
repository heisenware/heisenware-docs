// A page dropped on a trigger: the executor then runs whenever a user
// opens that page (Trigger.jsx handleDrop, source type ui/onPageLoad).
//
// The gesture leaves the trigger configured, so the storyboard clears the
// page source again before it records: run it twice and the second clip
// looks like the first.
//
// The node is selected while the explorer is CLOSED - fit-view puts the
// board's nodes where the explorer's panel would cover them, and
// Playwright will not click through a panel. With the node selected the
// panel can come back and F frames the selection again, now inside the
// narrower board.
const NODE = 'nj4u6CRGgas' // SignalSimulator.getValues on filler

module.exports = {
  name: 'trigger-from-a-page',
  description: 'Dragging a page from the Pages explorer onto a trigger (GIF)',
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
    await page.waitForTimeout(1000)

    const toggle = async label => {
      const button = page.locator(`[aria-label="${label}"]`)
      if (await button.count()) {
        await button.first().click()
        await page.waitForTimeout(600)
      }
    }
    for (const label of ['Close Console', 'Toggle Page editor', 'Hide mini map', 'Toggle Explorer']) {
      await toggle(label)
    }

    const node = page.locator(`.react-flow__node[data-id="${NODE}"]`)
    await page.mouse.click(640, 700)
    await page.keyboard.press('f')
    await page.waitForTimeout(1500)
    await node.click({ position: { x: 4, y: 4 } })
    await page.waitForTimeout(400)

    // the Pages explorer back, and the selection framed inside what is
    // left of the board
    await toggle('Toggle Explorer')
    await page.locator('[aria-label="Pages and actions"]').first().click()
    await page.waitForTimeout(1200)
    await page.keyboard.press('f')
    await page.waitForTimeout(1600)

    // deselect without hitting the node
    const framed = await node.boundingBox()
    await page.mouse.click(640, Math.min(780, framed.y + framed.height + 60))
    await page.waitForTimeout(600)

    // Start from an unconfigured trigger whatever the last run left: the
    // ✕ of a trigger source is TriggerDetail.jsx's ClearButton, and the
    // node's other items carry the same icon, so the one next to the
    // source's own words is the one to press.
    for (let i = 0; i < 4; i++) {
      if (await node.getByText('Click to configure').count()) break
      const cleared = await page.evaluate(id => {
        const node = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        for (const icon of node.querySelectorAll('svg[data-testid="ClearIcon"]')) {
          const button = icon.closest('button')
          const row = button?.parentElement
          if (row && /page load|app start|app stop|browser|input update|click/i.test(row.textContent || '')) {
            button.click()
            return true
          }
        }
        return false
      }, NODE)
      if (!cleared) break
      await page.waitForTimeout(1200)
    }

    // keep the frame on the gesture: the board's own toolbar and the
    // neighbouring nodes are not part of it
    await page.evaluate(id => {
      const style = document.createElement('style')
      style.textContent =
        `.react-flow__node:not([data-id*="${id}"]) { visibility: hidden !important; }` +
        '.react-flow__edge { visibility: hidden !important; }'
      document.head.appendChild(style)
      const fit = document.querySelector('[aria-label="Fit View (F)"]')
      const bar = fit && fit.closest('.MuiPaper-root')
      if (bar) bar.style.visibility = 'hidden'
    }, NODE)
    await page.waitForTimeout(400)

    const grip = page.getByText('Photos', { exact: true })
      .locator('xpath=ancestor::*[@draggable="true"][1]')
    const target = node.getByText('Click to configure').first()

    const from = await grip.boundingBox()
    const to = await target.boundingBox()
    const nodeBox = await node.boundingBox()

    // from the explorer's panel (not its icon rail, which starts at 0) to
    // the right edge of the node, with the panel's heading and both pages
    // the explorer's icon rail is the leftmost 32 px and belongs to the
    // Builder's chrome, not to this gesture; its panel starts right of it
    // and its heading sits just under the top bar
    const left = 36
    const top = 48
    await m.focus({
      x: left,
      y: top,
      width: Math.max(nodeBox.x + nodeBox.width, from.x + from.width) - left,
      height: Math.max(from.y + from.height, nodeBox.y + nodeBox.height) - top
    }, 12)

    await m.cursorAt([from.x + from.width / 2, from.y + from.height / 2 + 70])
    await m.hold(1200)
    await m.moveTo({ x: from.x + from.width / 2, y: from.y + from.height / 2 }, { steps: 12 })
    await m.hold(500)
    await m.dragTo({ x: to.x + to.width / 2, y: to.y + to.height / 2 }, { steps: 30, settle: 900 })
    // the drop opens the trigger's menu; the clip ends on the result
    await m.hold(900)
    await page.keyboard.press('Escape')
    await m.hold(2800)
  }
}
