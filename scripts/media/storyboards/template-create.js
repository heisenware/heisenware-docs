// The Template editor, recorded on the "Docs: template editor" App:
//
//   template-editor-icon.png          the four editor icons in the top bar
//   template-create.gif               a template made from the list
//   template-list.png                 the workspace's templates, with rename and trash
//   template-placeholder-settings.png a placeholder selected, its Settings beside it
//   pdf-lab-template.png              the acceptance report with all its placeholders
//
// It builds what it photographs: the throwaway template of the GIF is
// removed again at the end, and AcceptanceReport is dropped and drawn
// from scratch, so a re-run leaves the workspace as it found it. The one
// thing it needs is the blank form at
// /shared/uploads/docs-pdf-lab/acceptance_report.pdf (the lab's
// .gitbook/assets/acceptance_report.pdf, uploaded once).
//
// The page is A4 in POINTS (595 x 842) and the Konva stage draws an
// element at 2 * pt * zoomFactor, so every click on the page is computed
// from the stage's measured box - never from a coordinate read off a
// screenshot.
const APP = { domain: 'acme.default', appId: 'ue4vw', appName: 'Docs: template editor' }
const TEMPLATE = 'AcceptanceReport'
const SCRATCH = 'DeliveryNote'           // made and removed by the GIF
const UPLOAD = 'acceptance_report'       // in uploads/docs-pdf-lab

// the value cells of the blank form, measured on the PDF
const TEXTS = [
  { name: 'customerName', x: 225, y: 109, w: 300, h: 22 },
  { name: 'projectId', x: 225, y: 143, w: 300, h: 22 },
  { name: 'acceptanceDate', x: 225, y: 177, w: 300, h: 22 },
  { name: 'comments', x: 225, y: 215, w: 310, h: 130 }
]
const IMAGE = { name: 'signature.base64', x: 50, y: 370, w: 170, h: 62, kind: 'image' }
const FONT_SIZE = '14'

module.exports = {
  name: 'template-create',
  description: 'Template editor: the icon, making a template, the list, a placeholder and the finished template',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams(APP)
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(10000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    const closeConsole = page.getByRole('button', { name: 'Close Console' })
    if (await closeConsole.count()) await closeConsole.first().click()
    await page.waitForTimeout(600)

    const editor = page.getByRole('button', { name: 'Template editor' })
    await editor.click()
    await page.waitForTimeout(3500)

    // --- the four editor icons, the template one in force -------------------
    await page.mouse.move(800, 500)   // no tooltip over the icons
    await page.waitForTimeout(1200)
    await m.focus({ x: 30, y: 4, width: 122, height: 34 }, 4)
    await m.still('template-editor-icon')

    /** The template's name at the top right opens the workspace's list. */
    const nameChip = () => page.locator('div').filter({ hasText: /^(.+)$/ }).nth(0)
    const openList = async () => {
      if (await page.getByText('Add new template').count()) return
      await page.mouse.click(1649, 68)
      await page.waitForTimeout(1100)
    }
    const row = name => page.locator('li').filter({ hasText: name })
    const removeTemplate = async name => {
      await openList()
      if (!(await row(name).count())) return
      await row(name).first().locator('svg[data-testid="DeleteIcon"]').click()
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: /^remove$/i }).click()
      await page.waitForTimeout(3000)
    }

    await removeTemplate(SCRATCH)
    await removeTemplate(TEMPLATE)

    // --- the GIF: a template is made ---------------------------------------
    // everything the clip has to hold: the list popover, the create form and
    // the empty page the editor opens on
    m.unfocus()
    await m.focus({ x: 1252, y: 40, width: 426, height: 640 }, 0)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    await m.cursorAt([1500, 400])
    await m.hold(1000)

    await m.click([1649, 68])
    await page.waitForTimeout(1100)
    await m.hold(1400)

    await m.click(page.getByText('Add new template'))
    await page.waitForTimeout(1200)
    await m.hold(900)

    await m.click(page.getByLabel('Template Name'))
    await m.type(SCRATCH, { delay: 70 })
    await m.hold(700)

    await m.click(page.getByLabel('Template Type'))
    await page.waitForTimeout(700)
    await m.hold(700)
    await m.click(page.getByRole('option', { name: /pdf/i }).first())
    await page.waitForTimeout(600)
    await m.hold(600)

    await m.click(page.getByLabel('Page Format'))
    await page.waitForTimeout(700)
    await m.hold(700)
    await m.click(page.getByRole('option', { name: /^a4$/i }).first())
    await page.waitForTimeout(600)
    await m.hold(900)

    await m.click(page.getByRole('button', { name: /create template/i }))
    await page.waitForTimeout(4000)
    await m.hold(2600)

    // --- the list, with the rename pencil and the trash --------------------
    await openList()
    await page.mouse.move(1400, 300)
    await page.waitForTimeout(1200)
    m.unfocus()
    await m.focus(page.locator('#pdf-template-navigation-modal-title').locator('xpath=..'), 0)
    await m.still('template-list')

    await removeTemplate(SCRATCH)

    // --- AcceptanceReport, drawn from scratch ------------------------------
    await openList()
    await page.getByText('Add new template').click()
    await page.waitForTimeout(1200)
    await page.getByLabel('Template Name').fill(TEMPLATE)
    await page.getByLabel('Template Type').click()
    await page.waitForTimeout(600)
    await page.getByRole('option', { name: /pdf/i }).first().click()
    await page.waitForTimeout(400)
    await page.getByLabel('Page Format').click()
    await page.waitForTimeout(600)
    await page.getByRole('option', { name: /^a4$/i }).first().click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /create template/i }).click()
    await page.waitForTimeout(4000)

    /** The stage, measured; everything on the page is placed through it. */
    let stage = await page.evaluate(() => {
      const r = document.querySelector('.konvajs-content').getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    const zoom = () => stage.width / (2 * 595)
    const toCanvas = (xPt, yPt) => ({ x: stage.x + 2 * xPt * zoom(), y: stage.y + 2 * yPt * zoom() })

    // the background: dragged out of the Files explorer, as the lab says
    await page.getByRole('button', { name: 'Files' }).click()
    await page.waitForTimeout(2000)
    const folder = page.getByText('docs-pdf-lab', { exact: true })
    if (await folder.count()) {
      await folder.dblclick()
      await page.waitForTimeout(2000)
    }
    const file = page.getByText(UPLOAD, { exact: false }).first()
    const b = await file.boundingBox()
    if (!b) throw new Error(`${UPLOAD} is not in the Files explorer; upload it to uploads/docs-pdf-lab first`)
    const drop = { x: stage.x + stage.width / 2, y: stage.y + 200 }
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
    await page.mouse.down()
    for (const d of [4, 12, 40]) {
      await page.mouse.move(b.x + b.width / 2 + d, b.y + b.height / 2 + d / 2)
      await page.waitForTimeout(120)
    }
    for (let i = 1; i <= 30; i++) {
      await page.mouse.move(b.x + 40 + (drop.x - b.x - 40) * i / 30, b.y + 20 + (drop.y - b.y - 20) * i / 30)
      await page.waitForTimeout(35)
    }
    await page.waitForTimeout(500)
    await page.mouse.up()
    await page.waitForTimeout(3500)

    // the placeholders. Placing one does NOT select it
    // (PdfTemplatePage.handleAdd only adds), so the new box is clicked
    // afterwards; the Settings panel still holding the factory name is how
    // the right element is recognized.
    const resizeTo = el => {
      const from = toCanvas(el.x + 160, el.y + (el.kind === 'image' ? 160 : 20))
      const to = toCanvas(el.x + el.w, el.y + el.h)
      return (async () => {
        await page.mouse.move(from.x, from.y)
        await page.mouse.down()
        for (let i = 1; i <= 12; i++) {
          await page.mouse.move(from.x + (to.x - from.x) * i / 12, from.y + (to.y - from.y) * i / 12)
          await page.waitForTimeout(40)
        }
        await page.mouse.up()
        await page.waitForTimeout(800)
      })()
    }
    const place = async (el, tool) => {
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
      await page.getByRole('button', { name: tool }).click()
      await page.waitForTimeout(500)
      const p = toCanvas(el.x, el.y)
      await page.mouse.click(p.x, p.y)
      await page.waitForTimeout(1800)

      const field = page.getByLabel('Variable Name')
      let ok = false
      for (let attempt = 0; attempt < 4 && !ok; attempt++) {
        const inside = toCanvas(el.x + (el.kind === 'image' ? 60 : 50), el.y + (el.kind === 'image' ? 60 : 10))
        await page.mouse.click(inside.x, inside.y)
        await page.waitForTimeout(1200)
        ok = (await field.count()) > 0 && (await field.inputValue()) === 'use.toolbar.to.edit'
      }
      if (!ok) throw new Error(`could not select the new ${el.name} placeholder`)

      await resizeTo(el)
      await field.fill(el.name)
      await page.keyboard.press('Tab')
      await page.waitForTimeout(800)
      if (el.kind !== 'image') {
        await page.getByLabel('Font Size').fill(FONT_SIZE)
        await page.keyboard.press('Tab')
        await page.waitForTimeout(900)
      }
      if ((await field.inputValue()) !== el.name) throw new Error(`${el.name} did not stick`)
    }

    for (const t of TEXTS) await place(t, 'Add Text Variable')
    await place(IMAGE, 'Add Image Variable')

    // --- a placeholder and its Settings ------------------------------------
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    const first = toCanvas(TEXTS[0].x + 50, TEXTS[0].y + 10)
    await page.mouse.click(first.x, first.y)
    await page.waitForTimeout(1500)
    await page.mouse.move(1000, 700)
    await page.waitForTimeout(800)
    m.unfocus()
    await m.focus({ x: 896, y: 42, width: 784, height: 620 }, 0)
    await m.still('template-placeholder-settings')

    // --- the finished template, nothing selected ---------------------------
    // Escape only reaches the editor while the pointer is over the page
    // (PdfTemplatePage's key handler checks isMouseOver), so park it there
    // first and take the pointer away afterwards.
    await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height - 60)
    await page.waitForTimeout(400)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1500)
    await page.mouse.move(900, 800)
    await page.waitForTimeout(800)
    stage = await page.evaluate(() => {
      const r = document.querySelector('.konvajs-content').getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    m.unfocus()
    await m.focus(stage, 8)
    await m.still('pdf-lab-template')
  }
}
