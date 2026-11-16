// A button's click as a trigger source: the executor's trigger is dragged
// onto the button in the Page editor, which links the widget's onClick to
// it (frontend-builder/page/Page.jsx, the useDrop that calls linkItem).
//
// Like trigger-from-a-page.js the gesture leaves its mark, so the
// storyboard clears the source again before it records.
const NODE = 'P90t5kHKiHc' // MqttClient.publishJson on internal-mqtt
const PAGE = 'Setpoint'

module.exports = {
  name: 'trigger-from-a-button',
  description: 'Dragging a trigger onto a button in the Page editor (GIF)',
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
    await toggle('Close Console')
    await toggle('Hide mini map')

    // the page the button lives on, picked in the Pages explorer
    await page.locator('[aria-label="Pages and actions"]').first().click()
    await page.waitForTimeout(1200)
    await page.getByText(PAGE, { exact: true }).first().click()
    await page.waitForTimeout(1500)
    // the explorer has done its work; the board needs the room
    await toggle('Toggle Explorer')

    const node = page.locator(`.react-flow__node[data-id="${NODE}"]`)
    await page.mouse.click(500, 700)
    await page.keyboard.press('f')
    await page.waitForTimeout(1500)
    await node.click({ position: { x: 4, y: 4 } })
    await page.waitForTimeout(400)
    await page.keyboard.press('f')
    await page.waitForTimeout(1600)
    const framed = await node.boundingBox()
    await page.mouse.click(400, Math.min(770, framed.y + framed.height + 60))
    await page.waitForTimeout(600)

    // start from a trigger with no widget source, whatever the last run left
    for (let i = 0; i < 4; i++) {
      const cleared = await page.evaluate(id => {
        const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        for (const icon of el.querySelectorAll('svg[data-testid="ClearIcon"]')) {
          const button = icon.closest('button')
          const row = button?.parentElement
          if (row && /click|page load|app start|app stop|browser|input update/i.test(row.textContent || '')) {
            button.click()
            return true
          }
        }
        return false
      }, NODE)
      if (!cleared) break
      await page.waitForTimeout(1200)
    }

    // the frame is the node and the page beside it, without the board's
    // own toolbar or the neighbouring nodes
    await page.evaluate(id => {
      const style = document.createElement('style')
      style.textContent =
        `.react-flow__node:not([data-id*="${id}"]) { visibility: hidden !important; }` +
        '.react-flow__edge { visibility: hidden !important; }'
      document.head.appendChild(style)
      const fit = document.querySelector('[aria-label="Fit View (F)"]')
      const bar = fit && fit.closest('div[class*="Paper"], div[class*="toolbar"]')
      if (bar) bar.style.visibility = 'hidden'
    }, NODE)
    await page.waitForTimeout(400)

    // What is dragged is the trigger item's GRIP - the dotted handle
    // Item.jsx makes draggable - not the play button beside it.
    const trigger = node.getByText('Click to configure').first()
    const button = page.getByText('Send setpoint').first()
    const pill = await trigger.boundingBox()
    const from = await page.evaluate(([id, right]) => {
      const el = document.querySelector(`.react-flow__node[data-id="${id}"]`)
      const grips = [...el.querySelectorAll('div[draggable="true"]')]
        .map(g => g.getBoundingClientRect())
        .filter(r => r.width > 4 && r.width < 40 && r.x >= right - 4)
        .sort((a, b) => a.x - b.x)
      return grips.length ? grips[0].toJSON() : null
    }, [NODE, pill.x + pill.width])
    if (!from) throw new Error('No drag grip found on the trigger')
    const to = await button.boundingBox()
    const nodeBox = await node.boundingBox()

    const top = Math.max(40, Math.min(nodeBox.y, to.y) - 90)
    await m.focus({
      x: Math.max(0, nodeBox.x - 20),
      y: top,
      width: Math.min(1280, to.x + to.width + 150) - Math.max(0, nodeBox.x - 20),
      height: Math.max(nodeBox.y + nodeBox.height, to.y + to.height + 40) - top
    }, 12)

    await m.cursorAt([from.x + from.width / 2, from.y + from.height / 2 + 70])
    await m.hold(1200)
    await m.moveTo({ x: from.x + from.width / 2, y: from.y + from.height / 2 }, { steps: 12 })
    await m.hold(500)
    await m.dragTo({ x: to.x + to.width / 2, y: to.y + to.height / 2 }, { steps: 32, settle: 1000 })
    await m.hold(1200)
    await page.keyboard.press('Escape')
    await m.hold(2800)
  }
}
