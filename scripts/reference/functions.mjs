#!/usr/bin/env node
/**
 * Checks the function reference (reference/functions/**) against the class
 * sources in heisenware-cloud, and prints what a page needs.
 *
 * The function pages are written by hand: they explain, give examples and
 * warn. What must not drift is the list of functions and their inputs, and
 * that is what the code decides: the JSDoc of a class IS its interface in
 * the App Builder (VRPC reflects every `@param` as an input of the
 * executor). This script reads the JSDoc the way the agents do
 * (`VrpcAdapter._parseComments`) and compares it with the pages.
 *
 * Usage:
 *   node scripts/reference/functions.mjs [--cloud <path>]         the drift report
 *   node scripts/reference/functions.mjs --check                  the same, exit 1 on drift
 *   node scripts/reference/functions.mjs --class Modbus           one class
 *   node scripts/reference/functions.mjs --dump Modbus            the class's interface as markdown
 *   node scripts/reference/functions.mjs --json                   the report as JSON
 *
 * A page documents a function with a heading that carries its name in
 * backticks (### `connectTcp`); a heading may name several (### `on` / `off`).
 *
 * Reported per class:
 *   undocumented   published functions without a heading on the page
 *   unknown        headings that name no published function of the class
 *   inputs         documented functions whose page never mentions an input
 *                  the code declares (by name, anywhere in its section)
 * and once: classes without a page, pages without a class.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const argAfter = flag => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined)
const CLOUD = path.resolve(argAfter('--cloud') ?? path.join(DOCS, '..', 'heisenware-cloud'))
const ONLY = argAfter('--class')
const DUMP = argAfter('--dump')
const CHECK = args.includes('--check')
const JSON_OUT = args.includes('--json')

const require = createRequire(path.join(CLOUD, 'connectors', 'package.json'))
const { VrpcAdapter } = require('vrpc')
const acorn = createRequire(path.join(CLOUD, 'package.json'))('acorn')

/**
 * Every class a member makes executors from: its source and its page(s).
 * `pages` may list several: the class is spread over them (Tools), or its
 * page documents more than one class (Heidenhain).
 * `internal: true`: a class the platform serves but no page documents
 * (control classes, see the platform law §6.7).
 */
const CLASSES = [
  // Connectors
  ['AllenBradley', 'connectors/src/allenbradley/AllenBradley.js', ['connectors/allen-bradley.md']],
  ['Busylight', 'connectors/src/busylight/Busylight.js', ['connectors/kuando-busylight.md']],
  ['CtrlX', 'connectors/src/ctrlx/CtrlX.js', ['connectors/ctrlx-data-layer.md']],
  ['Database', 'connectors/src/database/Database.js', ['storage/relational-database.md', 'utilities/pdf-templates.md']],
  ['Email', 'connectors/src/email/Email.js', ['connectors/email.md']],
  ['File', 'connectors/src/file/File.js', ['connectors/file-i-o.md']],
  ['GpioCounter', 'connectors/src/gpiocounter/GpioCounter.js', ['connectors/gpio-counter.md']],
  ['Graphql', 'connectors/src/graphql/Graphql.js', ['connectors/graphql.md']],
  ['Heidenhain', 'connectors/src/heidenhain/Heidenhain.js', ['connectors/heidenhain-opc-ua.md', 'connectors/heidenhain-dnc.md']],
  ['Http', 'connectors/src/http/Http.js', ['connectors/http-rest.md']],
  ['Influx', 'connectors/src/influx/Influx.js', ['storage/timeseries-database.md']],
  ['Label', 'connectors/src/label/Label.js', ['connectors/label-printer.md']],
  ['Mip', 'connectors/src/mip/Mip.js', ['connectors/hydra-mip.md']],
  ['Modbus', 'connectors/src/modbus/Modbus.js', ['connectors/modbus.md']],
  ['MqttClient', 'connectors/src/mqttclient/MqttClient.js', ['connectors/mqtt-client.md']],
  ['OpcuaClient', 'connectors/src/opcuaclient/OpcuaClient.js', ['connectors/opc-ua-client.md']],
  ['OpcuaServer', 'connectors/src/opcuaserver/OpcuaServer.js', ['connectors/opc-ua-server.md']],
  ['OS', 'connectors/src/os/Os.js', ['connectors/operating-system-os.md']],
  ['S7', 'connectors/src/s7/S7.js', ['connectors/siemens-s7.md']],
  ['SapDigitalManufacturing', 'connectors/src/sap/SapDigitalManufacturing.js', ['connectors/sap-digital-manufacturing.md']],
  ['Serial', 'connectors/src/serial/Serial.js', ['connectors/rs-232-485.md']],
  ['TrustStore', 'connectors/src/truststore/TrustStore.js', ['connectors/trusted-certificates.md']],
  ['Zebra', 'connectors/src/zebra/Zebra.js', ['connectors/zebra-rfid-iot.md']],
  // Utility Functions
  ['Accumulator', 'utilityFunctions/src/accumulator/Accumulator.js', ['storage/accumulator.md']],
  ['Barcode', 'utilityFunctions/src/barcode/Barcode.js', ['utilities/barcode-generation.md']],
  ['Buffer', 'utilityFunctions/src/buffer/Buffer.js', ['storage/buffer.md']],
  ['Counter', 'utilityFunctions/src/counter/Counter.js', ['utilities/counter.md']],
  ['Cron', 'utilityFunctions/src/cron/Cron.js', ['utilities/cron.md']],
  ['DataStore', 'utilityFunctions/src/dataStore/DataStore.js', ['storage/data-store.md']],
  ['Pdf', 'utilityFunctions/src/pdf/Pdf.js', ['utilities/pdf-processing.md']],
  ['SignalSimulator', 'utilityFunctions/src/signalSimulator/SignalSimulator.js', ['utilities/signal-simulation.md']],
  ['Simulator', 'utilityFunctions/src/simulator/Simulator.js', ['utilities/data-simulation.md']],
  ['Stopwatch', 'utilityFunctions/src/stopwatch/Stopwatch.js', ['utilities/stopwatch.md']],
  ['Timer', 'utilityFunctions/src/timer/Timer.js', ['utilities/timer.md']],
  ['Tools', 'utilityFunctions/src/tools/Tools.js', ['utilities/data-processing.md']],
  ['Trigger', 'utilityFunctions/src/tools/Trigger.js', ['utilities/event-simulation.md']],
  ['Users', 'utilityFunctions/src/users/Users.js', ['utilities/users.md']],
  // Media Server and Templates
  ['Files', 'mediaServer/src/Files.js', ['storage/files.md']],
  ['PdfTemplate', 'templates/src/pdf/PdfTemplate.js', ['utilities/pdf-templates.md']]
]

/**
 * Functions the pages deliberately leave out, with the reason. These are not
 * building blocks a member wires: platform helpers, diagnostics that answer a
 * library object, and the functions an editor calls on a member's behalf.
 * Reviewed 2026-11-16 while the reference was brought to v93.
 */
const INTERNAL = {
  'Database.getFileHolds': 'platform helper: which columns hold files',
  'Database.getLegacyFileCells': 'platform helper for the file migration',
  'Database.checkFileCells': 'platform helper for the file migration',
  'Database.getSource': 'platform helper: names the data source for the data tools',
  'Influx.getSource': 'platform helper: names the data source for the data tools',
  'Serial.getBinding': 'diagnostic: answers the serial library binding, unusable in a flow',
  'PdfTemplate.create': 'the Template editor makes templates, not the Flowboard',
  'PdfTemplate.getData': 'the Template editor',
  'PdfTemplate.addPage': 'the Template editor',
  'PdfTemplate.removePage': 'the Template editor',
  'PdfTemplate.addElement': 'the Template editor',
  'PdfTemplate.getElement': 'the Template editor',
  'PdfTemplate.changeElement': 'the Template editor',
  'PdfTemplate.deleteElement': 'the Template editor',
  'PdfTemplate.autoGenerateTemplateFields': 'the Template editor'
}

/**
 * Event functions whose registration carries a value of its own, so their
 * return is that value and not `true` (see the platform law, "Backend
 * events"). Their pages say what the value is.
 */
const ANSWERS_A_VALUE = new Set([
  'OpcuaClient.monitorNode',
  'OpcuaClient.monitorVariable',
  'Influx.subscribeToChange',
  'Trigger.triggerCallback'
])

/** Pages of the function reference that document no class of their own. */
const PAGES_WITHOUT_CLASS = new Set([
  'README.md',
  'connectors/README.md',
  'storage/README.md',
  'utilities/README.md',
  'add-ons/README.md',
  'add-ons/industrial-blockchain.md'
])

const REF = path.join(DOCS, 'reference', 'functions')

/**
 * The functions a class source declares on the class itself, read from its
 * syntax tree: { name -> 'static' | 'instance' }. Underscore and #private
 * names, getters and setters are never published.
 */
function declaredFunctions (source, className) {
  const tree = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true, allowReturnOutsideFunction: true })
  const classes = []
  const visit = node => {
    if (!node || typeof node.type !== 'string') return
    if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') classes.push(node)
    for (const key of Object.keys(node)) {
      const child = node[key]
      if (Array.isArray(child)) child.forEach(visit)
      else if (child && typeof child.type === 'string') visit(child)
    }
  }
  visit(tree)
  const cls = classes.find(c => c.id?.name === className) ?? classes.find(c => c.id?.name?.toLowerCase() === className.toLowerCase()) ?? classes[classes.length - 1]
  const out = {}
  if (!cls) return out
  for (const m of cls.body.body) {
    if (m.type !== 'MethodDefinition' || m.key.type !== 'Identifier' || m.computed) continue
    if (m.kind === 'get' || m.kind === 'set') continue
    const name = m.kind === 'constructor' ? '__createShared__' : m.key.name
    if (name.startsWith('_') && name !== '__createShared__') continue
    out[name] = m.static ? 'static' : 'instance'
  }
  return out
}

/** The published functions of a class source: name -> { description, params, ret, kind }. */
function classInterface (file, className) {
  const source = fs.readFileSync(file, 'utf8')
  const meta = VrpcAdapter._parseComments(source)
  const declared = declaredFunctions(source, className)
  const out = {}
  for (const [name, where] of Object.entries(declared)) {
    const doc = meta[name] ?? {}
    const params = doc.params ?? []
    const isEvent = params.some(p => /^(function|callback|event)$/i.test(String(p.type)))
    const fn = name === '__createShared__' ? 'create' : name
    out[fn] = {
      description: doc.description ?? '',
      // the constructor's doc block names the instance first: that is the instance input, not a parameter
      params: fn === 'create' ? params.filter(p => p.name !== 'instanceName') : params,
      ret: doc.ret,
      documented: Boolean(meta[name]),
      kind: fn === 'create' ? 'constructor' : where === 'static' ? 'static' : isEvent ? 'event' : 'instance'
    }
  }
  return out
}

/** The sections of a page: [{ names: ['on', 'off'], text }] per heading that names functions. */
function pageSections (file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const sections = []
  let current = null
  let fence = false
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence
    const h = !fence && /^(#{2,4})\s+(.*)$/.exec(line)
    if (h && /`[A-Za-z_]\w*`/.test(h[2])) {
      const names = [...h[2].matchAll(/`([A-Za-z_]\w*)(?:\(\))?`/g)].map(m => m[1])
      current = { level: h[1].length, names, text: '' }
      sections.push(current)
      continue
    }
    if (h && current && h[1].length <= current.level) current = null
    if (current) current.text += line + '\n'
  }
  return sections
}

function report () {
  const findings = []
  const pagesSeen = new Set()
  for (const [name, source, pages] of CLASSES) {
    if (ONLY && ONLY !== name) continue
    const file = path.join(CLOUD, source)
    if (!fs.existsSync(file)) {
      findings.push({ class: name, problem: 'source-missing', detail: source })
      continue
    }
    const iface = classInterface(file, name)
    const existing = pages.filter(p => fs.existsSync(path.join(REF, p)))
    pages.forEach(p => pagesSeen.add(p))
    if (!existing.length) {
      findings.push({ class: name, problem: 'no-page', detail: `${pages.join(', ')} (${Object.keys(iface).length} functions)` })
      continue
    }
    const sections = existing.flatMap(p => pageSections(path.join(REF, p)).map(s => ({ ...s, page: p })))
    const documented = new Map()
    for (const s of sections) for (const n of s.names) if (!documented.has(n)) documented.set(n, s)
    const published = Object.keys(iface)
    // VrpcAdapter._parseComments strips JSDoc tags, so `@deprecated` never
    // reaches us: a deprecated function announces itself in its prose, which
    // is the one part of the block VRPC publishes.
    const undocumented = published.filter(n => !documented.has(n) && !/\bDEPRECATED\b/i.test(iface[n].description) && !INTERNAL[`${name}.${n}`])
    // a page shared by several classes: its other headings are theirs
    const shared = CLASSES.filter(([n, , ps]) => n !== name && ps.some(p => pages.includes(p)))
    const foreign = new Set(shared.flatMap(([n2, src]) => {
      const f = path.join(CLOUD, src)
      return fs.existsSync(f) ? Object.keys(classInterface(f, n2)) : []
    }))
    // every class can be instantiated, whether or not it writes a constructor,
    // and the destructor is the platform's: neither is declared in the source
    const unknown = [...documented.keys()].filter(n => !published.includes(n) && !foreign.has(n) && !['create', 'delete'].includes(n))
    const inputs = []
    for (const n of published) {
      const s = documented.get(n)
      if (!s) continue
      const missing = iface[n].params
        .filter(p => !/^(function|callback|event)$/i.test(String(p.type)))
        .map(p => p.name.split('.').pop())
        .filter(key => !new RegExp(`\\b${key}\\b`).test(s.text))
      if (missing.length) inputs.push(`${n}: ${[...new Set(missing)].join(', ')}`)
    }
    // An event function's return only confirms the subscription: the values
    // arrive on the event outputs (platform law, "Backend events"). Every
    // such function returns a registration object, never a plain value, so a
    // page that promises one is wrong.
    for (const n of published) {
      if (iface[n].kind !== 'event' && !/^on[A-Z]/.test(n)) continue
      if (ANSWERS_A_VALUE.has(`${name}.${n}`)) continue
      const s = documented.get(n)
      if (!s) continue
      const output = /#### Output\s*\n+([^\n]+)/.exec(s.text)
      const text = output?.[1] ?? ''
      if (!/registration|event output/i.test(text)) {
        findings.push({ class: name, pages: existing, problem: 'event-return', detail: `${n}: ${text.trim().slice(0, 60) || '(no Output section)'}` })
      }
    }
    if (undocumented.length) findings.push({ class: name, pages: existing, problem: 'undocumented', detail: undocumented.join(', ') })
    if (unknown.length) findings.push({ class: name, pages: existing, problem: 'unknown', detail: unknown.join(', ') })
    for (const i of inputs) findings.push({ class: name, pages: existing, problem: 'inputs', detail: i })
  }
  if (!ONLY) {
    const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.relative(REF, path.join(dir, e.name))] : [])
    for (const p of walk(REF)) {
      if (!pagesSeen.has(p) && !PAGES_WITHOUT_CLASS.has(p)) findings.push({ class: '-', problem: 'page-without-class', detail: p })
    }
  }
  return findings
}

function dump (name) {
  const entry = CLASSES.find(([n]) => n === name)
  if (!entry) throw new Error(`No class ${name}; known: ${CLASSES.map(c => c[0]).join(', ')}`)
  const iface = classInterface(path.join(CLOUD, entry[1]), name)
  const out = [`# ${name} (${entry[1]})`, '']
  for (const [fn, doc] of Object.entries(iface)) {
    out.push(`## \`${fn}\` (${doc.kind})`, '', doc.description.trim(), '')
    for (const p of doc.params) {
      const def = p.defaultValue !== undefined ? `, default ${p.defaultValue}` : ''
      out.push(`- \`${p.name}\` (${p.type}${p.optional ? ', optional' : ''}${def}): ${String(p.description ?? '').trim()}`)
    }
    if (doc.ret) out.push('', `Returns (${doc.ret.type}): ${String(doc.ret.description ?? '').trim()}`)
    out.push('')
  }
  return out.join('\n')
}

if (DUMP) {
  console.log(dump(DUMP))
} else {
  const findings = report()
  if (JSON_OUT) {
    console.log(JSON.stringify(findings, null, 1))
  } else if (!findings.length) {
    console.log('functions: the pages name every published function and input')
  } else {
    const byClass = new Map()
    for (const f of findings) byClass.set(f.class, [...(byClass.get(f.class) ?? []), f])
    for (const [cls, list] of byClass) {
      console.log(`\n${cls}${list[0].pages ? '  (' + list[0].pages.join(', ') + ')' : ''}`)
      for (const f of list) console.log(`  ${f.problem.padEnd(18)} ${f.detail}`)
    }
    console.log(`\nfunctions: ${findings.length} finding(s) in ${byClass.size} class(es)`)
  }
  if (CHECK && findings.length) process.exit(1)
}
