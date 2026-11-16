// What a Docker agent prints when it comes up: the banner from its
// entrypoint and the lines vrpc logs once the connection stands.
//
// There is no terminal to photograph in a headless run, so the storyboard
// typesets the log the way a terminal draws it. The text below is the real
// output of a slim Docker agent - the v93 connectors image run as
// `node index-slim.js` in a container, because the tag
// heisenware/docker-agent:v93-slim was not on Docker Hub yet - with only
// the three configured values (domain, broker, agent id) set to the ones
// the page's Example uses, so the picture and the command above it agree.
// Everything else, the class list included, is verbatim.
//
// To refresh it after a release:
//
//   docker run --rm \
//     -e HW_DOMAIN=<account>.<workspace> \
//     -e HW_BROKER=mqtts://<account>.heisenware.cloud:8883 \
//     -e HW_USERNAME=<name>@<account>.<workspace> \
//     -e HW_PASSWORD=<password> \
//     -e HW_AGENT_ID=my-agent-1 \
//     heisenware/docker-agent:v93-slim
//
// then paste the lines below, with the example's domain, broker and agent.
const BANNER = [
  '',
  ' _    _  ______   _    _____  ______  _   _ __          __       _____   ______',
  '| |  | ||  ____| | |  / ____||  ____|| \\ | |\\ \\        / //\\    |  __ \\ |  ____|',
  '| |__| || |__    | | | (___  | |__   |  \\| | \\ \\  /\\  / //  \\   | |__) || |__',
  '|  __  ||  __|   | |  \\___ \\ |  __|  |     |  \\ \\/  \\/ // /\\ \\  |  _  / |  __|',
  '| |  | || |____  | |  ____) || |____ | |\\  |   \\  /\\  // ____ \\ | | \\ \\ | |____',
  '|_|  |_||______| |_| |_____/ |______||_| \\_|    \\/  \\//_/    \\_\\|_|  \\_\\|______|',
  '',
  '',
  '### Starting application ###',
  '',
  ''
]

const T = '2026-11-16T15:45:51'
const HOST = '1577e7f560de'
const line = (ms, msg) =>
  `{"level":30,"time":"${T}.${ms}Z","pid":8,"hostname":"${HOST}","module":"index","msg":${JSON.stringify(msg)}}`

const LOG = [
  line('243', 'Domain : my-company.default'),
  line('243', 'Agent  : Docker Agent - my-agent-1'),
  line('243', 'Broker : mqtts://my-company.heisenware.cloud:8883'),
  line('243', 'Connecting to MQTT server...'),
  line('381', '[OK]'),
  line('381', 'Registering classes: Agent, Http, TrustStore, File, OS, S7, OpcuaClient, OpcuaServer, MqttClient, Modbus'),
  line('482', '[VrpcPersistor] Persistence layer enabled. Storage path: /shared/extensions/docker-agent---my-agent-1'),
  line('483', '[VrpcPersistor] No instances to restore.')
]

module.exports = {
  name: 'docker-agent-log',
  description: "The Docker agent's log after a successful start (PNG)",
  login: false,
  viewport: { width: 1620, height: 480 },

  async run ({ page, m }) {
    await page.setContent(`<!doctype html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; background: #1e1e1e; }
  pre {
    margin: 0;
    padding: 22px 24px;
    color: #e6e6e6;
    background: #1e1e1e;
    font: 12px/1.5 "DejaVu Sans Mono", "Liberation Mono", monospace;
    white-space: pre;
  }
  .dim { color: #9aa0a6; }
</style>
<pre id="t"></pre>`)
    await page.evaluate(([banner, log]) => {
      const el = document.getElementById('t')
      el.append(document.createTextNode(banner.join('\n')))
      const dim = document.createElement('span')
      dim.className = 'dim'
      dim.textContent = log.join('\n')
      el.append(dim)
    }, [BANNER, LOG])
    await page.waitForTimeout(400)

    const box = await page.evaluate(() => {
      const r = document.getElementById('t').getBoundingClientRect()
      return { x: 0, y: 0, width: Math.ceil(r.width), height: Math.ceil(r.height) }
    })
    await m.focus(box, 0)
    await m.still('docker-agent-log')
    m.unfocus()
  }
}
