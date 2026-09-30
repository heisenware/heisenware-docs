#!/usr/bin/env node
/**
 * Generates the widget reference (reference/widgets/) from the widget
 * sources in heisenware-cloud - the single source of truth:
 *
 * - manifest.json: name, category, one-line description, the properties
 *   the General tab lists under Receives and Emits (with value shape and
 *   example), the settings pinned by nature;
 * - config.js: the settings tabs, folded per tab by the platform's own
 *   compilePropsSchema; value types are written by its schemaTypeText,
 *   so the page says what the App Builder's tooltips say.
 *
 * A page has one generated block between `<!-- generated -->` and
 * `<!-- /generated -->`. Everything outside it - the GIF, a sentence on
 * when to use the widget - is written by hand and kept on every run;
 * front matter and title are regenerated.
 *
 * Usage:
 *   node scripts/reference/widgets.mjs [--cloud <path>] [--check] [--lint]
 * --cloud  the heisenware-cloud checkout (default: ../heisenware-cloud)
 * --check  write nothing; exit 1 and list the pages that are stale
 * --lint   write nothing; list what the sources leave the pages without
 *          (choices without labels, bindings without example or value
 *          shape) - fixes belong in heisenware-cloud
 */

import fs from 'node:fs'
import path from 'node:path'
import { register } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(DOCS, 'reference', 'widgets')

const args = process.argv.slice(2)
const argAfter = flag => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined)
const CLOUD = path.resolve(argAfter('--cloud') ?? path.join(DOCS, '..', 'heisenware-cloud'))
const CHECK = args.includes('--check')
const LINT = args.includes('--lint')
const WIDGETS = path.join(CLOUD, 'packages', 'widgets')

const START = '<!-- generated -->'
const END = '<!-- /generated -->'

/** Categories as the docs present them; `special` (the hidden App action widget) is no widget members place. */
const CATEGORIES = {
  display: { title: 'Display widgets', lead: 'Display widgets show data: values, lists, charts, media.' },
  input: { title: 'Input widgets', lead: 'Input widgets let users enter data: forms, files, photos, codes, signatures.' },
  trigger: { title: 'Trigger widgets', lead: 'Trigger widgets start something: run executors, switch pages, run App actions.' },
  layout: { title: 'Layout widgets', lead: 'Layout widgets hold other widgets.' }
}

/** What a property is linked to, in the glossary's words. */
const KIND = {
  output: 'output',
  status: 'status',
  errorHandler: 'error handler',
  file: 'file',
  input: 'input',
  trigger: 'trigger',
  page: 'page',
  action: 'App action'
}
const RECEIVES = ['output', 'status', 'errorHandler', 'file']
const EMITS = ['input', 'trigger', 'page', 'action']

/* ------------------------------------------------------------------ *
 * Reading the widget sources
 * ------------------------------------------------------------------ */

async function loadWidgets () {
  if (!fs.existsSync(WIDGETS)) {
    console.error(`widgets: no widget sources at ${WIDGETS} (use --cloud <path>)`)
    process.exit(2)
  }
  // the platform's loader: plain Node imports the shared ESM sources and their JSON fragments
  register(pathToFileURL(path.join(CLOUD, 'scripts', 'lib', 'widgetConfigLoader.mjs')))
  const { compilePropsSchema } = await import(pathToFileURL(path.join(WIDGETS, 'propsSchema.js')))
  const { schemaTypeText } = await import(pathToFileURL(path.join(WIDGETS, 'schemaMeta.js')))

  const folders = fs.readdirSync(WIDGETS, { withFileTypes: true })
    .filter(e => e.isDirectory() && fs.existsSync(path.join(WIDGETS, e.name, 'manifest.json')))
    .map(e => e.name)
    .sort()
  const manifests = {}
  for (const folder of folders) {
    const m = JSON.parse(fs.readFileSync(path.join(WIDGETS, folder, 'manifest.json'), 'utf8'))
    manifests[m.type] = m
  }
  const widgets = []
  for (const folder of folders) {
    const manifest = JSON.parse(fs.readFileSync(path.join(WIDGETS, folder, 'manifest.json'), 'utf8'))
    if (!CATEGORIES[manifest.category]) continue
    const config = path.join(WIDGETS, folder, 'config.js')
    const tabs = []
    if (fs.existsSync(config)) {
      const mod = await import(pathToFileURL(config))
      for (const tab of mod.tabs) {
        const schema = compilePropsSchema([tab], manifest.defaults, manifests)
        tabs.push({ title: tab.title, schema })
      }
    }
    widgets.push({ folder, manifest, tabs, slug: slugify(manifest.label) })
  }
  return { widgets, schemaTypeText }
}

const slugify = label => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

/** One table cell: no line breaks, no bare pipes. */
const cell = text => String(text ?? '').replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|').trim()

const sentence = text => {
  const t = cell(text)
  return t && !/[.!?:)]$/.test(t) ? t + '.' : t
}

function formatValue (value) {
  if (value === true) return 'on'
  if (value === false) return 'off'
  if (value === 'auto') return 'automatic'
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'object') {
    const json = JSON.stringify(value)
    return json.length <= 40 ? `\`${json}\`` : ''
  }
  return `\`${value}\``
}

/** The labeled choices of a setting ('Infinite scrolling', not 'virtual'). */
function choices (schema) {
  const s = schema.items && !schema.properties ? schema.items : schema
  if (Array.isArray(s.oneOf) && s.oneOf.every(o => o.const !== undefined)) {
    return s.oneOf.map(o => o.title ?? String(o.const))
  }
  if (Array.isArray(s.enum)) return s.enum.map(v => `\`${v}\``)
  return null
}

/** A value of the manifest's drop-in defaults by settings path ('appearance.fontSizeContent'). */
const atPath = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

function defaultOf (schema, fallback) {
  if (schema.default === undefined) {
    if (fallback === undefined) return ''
    schema = { ...schema, default: fallback }
  }
  if (Array.isArray(schema.oneOf)) {
    const hit = schema.oneOf.find(o => o.const === schema.default)
    if (hit?.title) return hit.title
  }
  return formatValue(schema.default)
}

/** "Show min/max is on", "Type is Line or Spline". */
function conditionText (props, siblings) {
  const parts = []
  for (const [key, cond] of Object.entries(props ?? {})) {
    const target = siblings[key] ?? {}
    const name = target.title ?? key
    const label = v => {
      const hit = target.oneOf?.find(o => o.const === v)
      if (hit?.title) return hit.title
      if (v === true) return 'on'
      if (v === false) return 'off'
      return `\`${v}\``
    }
    if (cond.const !== undefined) parts.push(`${name} is ${label(cond.const)}`)
    else if (Array.isArray(cond.enum)) {
      const vs = cond.enum.map(label)
      parts.push(`${name} is ${vs.length > 1 ? vs.slice(0, -1).join(', ') + ' or ' + vs.at(-1) : vs[0]}`)
    }
  }
  return parts.join(' and ')
}

/**
 * The settings of an object schema, flattened in panel order:
 * { path, name, schema, condition }. Nested objects and lists of
 * objects add their title as a prefix ("Appearance › Font size").
 */
function settingRows (schema, prefix = [], basePath = '', condition = '') {
  const rows = []
  const props = schema.properties ?? {}
  const add = (entries, cond) => {
    for (const [key, sub] of Object.entries(entries)) {
      if (!sub || typeof sub !== 'object') continue
      const p = basePath ? `${basePath}.${key}` : key
      const name = [...prefix, sub.title ?? key]
      if (sub.type === 'object' && sub.properties) {
        rows.push(...settingRows(sub, name, p, cond))
      } else if (sub.type === 'array' && sub.items?.properties) {
        rows.push({ path: p, name, schema: sub, condition: cond, list: true })
        rows.push(...settingRows(sub.items, name, `${p}[]`, cond))
      } else {
        rows.push({ path: p, name, schema: sub, condition: cond })
      }
    }
  }
  add(props, condition)
  for (const branch of schema.allOf ?? []) {
    if (branch.then?.properties) {
      const c = conditionText(branch.if?.properties, props)
      add(branch.then.properties, [condition, c].filter(Boolean).join(' and '))
    }
  }
  for (const [key, dep] of Object.entries(schema.dependencies ?? {})) {
    const branches = dep.oneOf ?? (dep.properties ? [dep] : [])
    for (const b of branches) {
      const extra = Object.fromEntries(Object.entries(b.properties ?? {}).filter(([k]) => k !== key))
      if (Object.keys(extra).length === 0) continue
      const cond = b.properties?.[key] ? conditionText({ [key]: b.properties[key].enum?.length === 1 ? { const: b.properties[key].enum[0] } : b.properties[key] }, props) : `${props[key]?.title ?? key} is set`
      add(extra, [condition, cond].filter(Boolean).join(' and '))
    }
  }
  // one row per setting, the first mention wins
  const seen = new Set()
  return rows.filter(r => (seen.has(r.path) ? false : seen.add(r.path)))
}

function settingsSection (widget) {
  const pins = new Set(widget.manifest.features?.pin ?? [])
  const out = []
  let pinned = false
  for (const tab of widget.tabs) {
    const rows = settingRows(tab.schema)
    if (rows.length === 0) continue
    out.push(`### ${tab.title}`, '', '| Setting | What it does | Default |', '|---|---|---|')
    for (const r of rows) {
      const bits = [sentence(r.schema.description)]
      const c = choices(r.schema)
      if (c && !r.list) bits.push(`Choices: ${c.join(', ')}.`)
      if (r.schema.minimum !== undefined && r.schema.maximum !== undefined) {
        bits.push(`Range ${r.schema.minimum} to ${r.schema.maximum}.`)
      }
      if (r.condition) bits.push(`Only when ${r.condition}.`)
      if (pins.has(r.path.replace(/\[\]/g, ''))) {
        bits.push('*Set per screen.*')
        pinned = true
      }
      const fallback = r.path.includes('[]') ? undefined : atPath(widget.manifest.defaults ?? {}, r.path)
      out.push(`| ${cell(r.name.join(' › '))} | ${bits.filter(Boolean).join(' ')} | ${r.list ? '' : defaultOf(r.schema, fallback)} |`)
    }
    out.push('')
  }
  if (out.length === 0) return []
  return [
    '## Settings',
    '',
    'Double-click the widget in the Page editor to open its settings.' +
      (pinned ? ' Settings marked *set per screen* are pinned by nature: every screen keeps its own value.' : ''),
    '',
    ...out
  ]
}

function propertiesSection (widget, schemaTypeText) {
  const accepts = widget.manifest.accepts ?? {}
  const rowsOf = kinds => kinds.flatMap(kind => (accepts[kind] ?? []).map(entry => ({ kind, entry })))
  const receives = rowsOf(RECEIVES)
  const emits = rowsOf(EMITS)
  if (receives.length === 0 && emits.length === 0) return []
  const table = (rows, withValue) => [
    withValue ? '| Property | Linked to | Value | What it does |' : '| Property | Linked to | What it does |',
    withValue ? '|---|---|---|---|' : '|---|---|---|',
    ...rows.map(({ kind, entry }) => {
      const hasValue = entry.valueSchema && Object.keys(entry.valueSchema).length > 0
      const value = hasValue || RECEIVES.includes(kind) ? `\`${cell(schemaTypeText(entry.valueSchema))}\`` : ''
      return withValue
        ? `| \`${entry.property}\` | ${KIND[kind]} | ${value} | ${sentence(entry.description)} |`
        : `| \`${entry.property}\` | ${KIND[kind]} | ${sentence(entry.description)} |`
    }),
    ''
  ]
  const out = [
    '## Properties',
    '',
    "The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.",
    ''
  ]
  if (receives.length) out.push('### Receives', '', ...table(receives, true))
  if (emits.length) {
    const withValue = emits.some(({ entry }) => entry.valueSchema && Object.keys(entry.valueSchema).length > 0)
    out.push('### Emits', '', ...table(emits, withValue))
  }
  const examples = [...receives, ...emits].filter(({ entry }) => entry.example !== undefined)
  if (examples.length) {
    out.push('### Example values', '', 'The same values fill an unlinked widget as demo data in the App Builder.', '')
    const names = [...receives, ...emits].map(({ entry }) => entry.property)
    const repeated = name => names.filter(n => n === name).length > 1
    for (const { kind, entry } of examples) {
      const label = repeated(entry.property) ? ` (${KIND[kind]})` : ''
      out.push(
        `<details>`,
        '',
        `<summary><code>${entry.property}</code>${label}</summary>`,
        '',
        '```json',
        JSON.stringify(entry.example, null, 2),
        '```',
        '',
        '</details>',
        ''
      )
    }
  }
  return out
}

function goodToKnow (widget) {
  const f = widget.manifest.features ?? {}
  const facts = []
  if (f.container) facts.push('It holds other widgets and repeats them, one tile per data row.')
  if (f.groupChild === false) facts.push('It cannot be placed inside a group.')
  if ((widget.manifest.accepts?.page ?? []).length || (widget.manifest.accepts?.action ?? []).length) {
    facts.push('Drag a page or an App action from the Pages and actions explorer onto it to run it on click.')
  }
  return facts.length ? ['## Good to know', '', ...facts.map(t => `* ${t}`), ''] : []
}

function generatedBlock (widget, schemaTypeText) {
  return [
    START,
    `<!-- Source: heisenware-cloud/packages/widgets/${widget.folder}. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->`,
    '',
    ...propertiesSection(widget, schemaTypeText),
    ...settingsSection(widget),
    ...goodToKnow(widget),
    END
  ].join('\n')
}

/** Front matter and title are generated; the hand-written parts around the block are kept. */
function page (widget, schemaTypeText, existing) {
  const head = [
    '---',
    `description: >-`,
    `  ${cell(widget.manifest.description)}`,
    '---',
    '',
    `# ${widget.manifest.label}`,
    ''
  ].join('\n')
  let before = '\n'
  let after = '\n'
  if (existing && existing.includes(START) && existing.includes(END)) {
    const body = existing.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*# .*\n/, '')
    before = body.slice(0, body.indexOf(START))
    after = body.slice(body.indexOf(END) + END.length)
  }
  return head + before + generatedBlock(widget, schemaTypeText) + after
}

function categoryPage (category, widgets, existing) {
  const { title, lead } = CATEGORIES[category]
  const block = [
    START,
    '<!-- Generated from the widget manifests. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->',
    '',
    '| Widget | What it does |',
    '|---|---|',
    ...widgets.map(w => `| [${w.manifest.label}](${w.slug}.md) | ${sentence(w.manifest.description)} |`),
    '',
    END
  ].join('\n')
  const head = ['---', `description: ${lead}`, '---', '', `# ${title}`, ''].join('\n')
  let before = '\n'
  let after = '\n'
  if (existing && existing.includes(START)) {
    const body = existing.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*# .*\n/, '')
    before = body.slice(0, body.indexOf(START))
    after = body.slice(body.indexOf(END) + END.length)
  }
  return head + before + block + after
}

function overviewPage (byCategory, existing) {
  const block = [
    START,
    '<!-- Generated from the widget manifests. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->',
    '',
    ...Object.keys(CATEGORIES).filter(c => byCategory[c]).flatMap(c => [
      `## [${CATEGORIES[c].title}](${c}/README.md)`,
      '',
      CATEGORIES[c].lead,
      '',
      byCategory[c].map(w => `[${w.manifest.label}](${c}/${w.slug}.md)`).join(' · '),
      ''
    ]),
    END
  ].join('\n')
  const head = ['---', 'description: Every widget, what it receives and emits, and its settings.', '---', '', '# Widgets', ''].join('\n')
  let before = '\n'
  let after = '\n'
  if (existing && existing.includes(START)) {
    const body = existing.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*# .*\n/, '')
    before = body.slice(0, body.indexOf(START))
    after = body.slice(body.indexOf(END) + END.length)
  }
  return head + before + block + after
}

/** What the sources leave the pages without: fixes belong in heisenware-cloud. */
function lint (widgets) {
  const findings = []
  for (const w of widgets) {
    const where = `packages/widgets/${w.folder}`
    for (const [kind, entries] of Object.entries(w.manifest.accepts ?? {})) {
      for (const e of entries) {
        const receives = RECEIVES.includes(kind)
        if (receives && e.example === undefined) findings.push(`${where}/manifest.json  ${kind} ${e.property}: no example`)
        if (receives && (!e.valueSchema || Object.keys(e.valueSchema).length === 0)) findings.push(`${where}/manifest.json  ${kind} ${e.property}: no valueSchema`)
      }
    }
    for (const tab of w.tabs) {
      for (const r of settingRows(tab.schema)) {
        const s = r.schema.items && !r.schema.properties ? r.schema.items : r.schema
        if (Array.isArray(s.enum) && !s.oneOf && !s.enum.every(v => typeof v === 'number')) findings.push(`${where}/config.js  ${r.path}: choices without labels (enum, not oneOf)`)
        if (!r.schema.description) findings.push(`${where}/config.js  ${r.path}: no description`)
      }
    }
  }
  return findings
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

async function main () {
  const { widgets, schemaTypeText } = await loadWidgets()
  if (LINT) {
    const findings = lint(widgets)
    console.log(findings.join('\n'))
    console.log(`\nwidgets: ${findings.length} gap(s) in the sources`)
    return
  }
  const files = new Map()
  const byCategory = {}
  for (const w of widgets) {
    const file = path.join(OUT, w.manifest.category, `${w.slug}.md`)
    const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    files.set(file, page(w, schemaTypeText, existing))
    ;(byCategory[w.manifest.category] ??= []).push(w)
  }
  for (const [category, list] of Object.entries(byCategory)) {
    list.sort((a, b) => a.manifest.label.localeCompare(b.manifest.label))
    const file = path.join(OUT, category, 'README.md')
    const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    files.set(file, categoryPage(category, list, existing))
  }
  const overview = path.join(OUT, 'README.md')
  files.set(overview, overviewPage(byCategory, fs.existsSync(overview) ? fs.readFileSync(overview, 'utf8') : null))

  const stale = []
  for (const [file, content] of files) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (current === content) continue
    stale.push(path.relative(DOCS, file))
    if (!CHECK) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content)
    }
  }
  if (CHECK) {
    if (stale.length) {
      console.log(`widgets: ${stale.length} page(s) out of date:\n  ${stale.join('\n  ')}`)
      process.exit(1)
    }
    console.log(`widgets: ${files.size} pages up to date`)
  } else {
    console.log(`widgets: ${widgets.length} widgets, ${stale.length} of ${files.size} pages written`)
  }
}

main()
