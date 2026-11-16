// Deploy: the current build becomes what users get, and the Distribute Your
// App dialog hands over the link and its QR code.
//
// Recorded on the "Docs: manager" app, which exists for the documentation.
// NEVER point this at an App that has users: a deploy is what they run.
module.exports = {
  name: 'deploy-an-app',
  description: 'Deploying an App and the link dialog it ends on (GIF)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: '970n8',
      appName: 'Docs: manager'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)
    // the console would sit under the dialog and say nothing here
    await page.getByRole('button', { name: 'Toggle Console' }).first().click()
    await page.waitForTimeout(800)

    const deploy = page.getByRole('button', { name: 'DEPLOY' }).first()
    const box = await deploy.boundingBox()

    // the top bar's right side and the dialog the deploy opens, in one frame
    await m.focus({ x: 560, y: 0, width: 1110, height: 706 }, 0)

    await m.cursorAt([1200, 300])
    await m.hold(1500)
    await m.click({ x: box.x + box.width / 2, y: box.y + box.height / 2 }, { steps: 18 })

    // the backend stops, a release version is saved and the backend starts
    // again: several seconds, with the button busy
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1200)
      await m.hold(500)
      const dialog = await page.locator('.MuiDialog-paper, [role="dialog"]').count()
      if (dialog) break
    }
    await m.hold(1500)
    await m.hold(3500)
  }
}
