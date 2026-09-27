// Signing in to the platform. Needs no credentials, so it doubles as the
// smoke test for the recording setup: `node record.js sign-in --out out`.
module.exports = {
  name: 'sign-in',
  description: 'Fills the sign-in form and hovers the Log in button (GIF)',
  login: false,

  async run ({ page, m, env }) {
    await page.goto(`${env.baseUrl}/manager/authentication/sign-in`, { waitUntil: 'networkidle' })
    await m.cursorAt([640, 120])
    await m.hold(800)

    await m.click(page.getByLabel('Account Name'))
    await m.type('my-company')
    await m.click(page.getByLabel('Email'))
    await m.type('jane@my-company.com')
    await m.click(page.getByLabel('Password'))
    await m.type('••••••••', { delay: 0 })

    await m.moveTo(page.getByRole('button', { name: 'Log in', exact: true }))
    await m.hold(1500)
  }
}
