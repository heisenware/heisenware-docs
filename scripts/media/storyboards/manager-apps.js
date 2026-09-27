// The App Manager as it greets a signed-in user. Template for everything
// that lives behind the login: set `login: true`, then navigate and record.
module.exports = {
  name: 'manager-apps',
  description: 'The App Manager start page after signing in (PNG)',
  login: true,

  async run ({ page, m }) {
    await page.waitForLoadState('networkidle')
    await m.still('manager-apps')
  }
}
