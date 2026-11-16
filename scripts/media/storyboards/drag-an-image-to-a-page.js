// A picture on a page: the file is uploaded once into the Files explorer and
// then dragged from there onto the canvas, where it becomes an image widget.
//
// The viewport is narrower than the other builder storyboards on purpose: the
// explorer sits at the left edge and the page editor at the right one, and the
// clip has to hold both ends of the drag.
//
// Recorded on the "Docs: Flowboard and pages" app; delete the image widget
// again before re-recording.
module.exports = {
  name: 'drag-an-image-to-a-page',
  description: 'Dragging an image file from the Files explorer onto a page (GIF)',
  login: true,
  viewport: { width: 1180, height: 820 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '68edk',
      appName: 'Docs: Flowboard and pages'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Toggle Console' }).first().click()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Files' }).first().click()
    await page.waitForTimeout(2500)
    // the flowboard's mini map sits in the clip's bottom corner
    const miniMap = page.getByRole('button', { name: 'Hide mini map' })
    if (await miniMap.count()) await miniMap.first().click()
    await page.waitForTimeout(600)

    // the page canvas is a device frame; design coordinates map into it
    const screen = await page.evaluate(() => {
      const r = document.querySelector('.screen').getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width }
    })
    const k = screen.width / 414
    const at = (dx, dy) => ({ x: Math.round(screen.x + dx * k), y: Math.round(screen.y + dy * k) })

    const file = page.locator('[draggable="true"]', { hasText: 'acme-floor-plan.png' }).first()

    await m.focus({ x: 18, y: 40, width: 1144, height: 625 }, 0)
    await m.cursorAt([300, 300])
    await m.hold(1000)

    await m.moveTo(file, { steps: 12 })
    await m.hold(700)
    await m.dragTo(at(207, 430), { steps: 26, delay: 70, settle: 900 })
    await m.hold(3200)
  }
}
