// The assistant building, live: a sentence in the Console, and the App
// changing while you watch. Recorded on the "Docs demo" app, where the ask
// is deliberately small so the clip stays short.
//
// Frames are sampled on a timer (the assistant's answer takes as long as it
// takes), and the whole window is captured because the chat, the Flowboard
// and the Page editor all move: record.js writes it full size and
// scripts/media/shrink.js halves it afterwards.
module.exports = {
  name: 'assistant-builds',
  description: 'The assistant building a widget from one sentence (GIF, full window)',
  login: true,
  viewport: { width: 1680, height: 950 },

  async run ({ page, m, env }) {
    const q = new URLSearchParams({
      domain: 'acme.default',
      appId: 'oias4',
      appName: 'Docs demo'
    })
    await page.goto(`${env.baseUrl}/builder?${q}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(9000)
    const notNow = page.getByRole('button', { name: /not now/i })
    if (await notNow.count()) await notNow.first().click()
    await page.waitForTimeout(800)

    await page.mouse.click(700, 400)
    await page.keyboard.press('f')
    await page.waitForTimeout(1800)

    const prompt = page.getByPlaceholder(/ask me to build/i).first()
    await m.click(prompt)
    await m.hold(400)
    await m.type('Put a heading on the page that reads "Packaging line 2".', { delay: 28 })
    await m.hold(900)
    await page.keyboard.press('Enter')

    // Sample the run until it ends: the assistant answers when it answers,
    // so the clip follows it rather than a fixed length. "Working ·" is the
    // line the Console shows while a tool call is in flight.
    let idle = 0
    for (let i = 0; i < 150; i++) {
      await m.hold(900)
      const working = await page.getByText(/Working ·/).count()
      idle = working ? 0 : idle + 1
      // three quiet samples after at least twenty: the run has settled
      if (i > 20 && idle >= 3) break
    }
    await m.hold(1800)
  }
}
