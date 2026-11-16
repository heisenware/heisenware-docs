// Every App Manager screen the docs show, in one signed-in pass.
// Each still is named after the asset the page references.
module.exports = {
  name: 'manager-screens',
  description: 'The App Manager: dashboard, apps, agents, integrations, AI clients, members (PNGs)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const screens = [
      ['dashboard', 'manager-dashboard'],
      ['apps', 'manager-apps-overview'],
      ['agents', 'agents-panel'],
      ['integrations', 'manager-integrations'],
      ['ai-clients', 'manager-ai-clients'],
      ['members', 'manager-members']
    ]
    for (const [route, asset] of screens) {
      await page.goto(`${env.baseUrl}/manager/${route}`, { waitUntil: 'networkidle' })
      // the screens fill from the bus after the first paint
      await page.waitForTimeout(2500)
      await m.still(asset)
    }
  }
}
