#!/usr/bin/env node
/**
 * Generates assistant/mcp-tools.md from the MCP server's tool catalog in
 * heisenware-cloud - the one place every tool is declared with its name,
 * its description, its input schema and the flags the surfaces act on
 * (`mcp/src/catalog.ts`).
 *
 * The catalog is TypeScript and pulls the whole tool core in with it, so
 * this script reads the BUILT catalog, `mcp/dist/catalog.js`, together
 * with `mcp/dist/surface.js` and `mcp/dist/gate.js`. It is the same
 * module the server registers from, so nothing is parsed or guessed:
 *
 * - `TOOLS` carries name, description, `mutating`, `destructive`,
 *   `localFiles`/`shared` and `user`;
 * - `visibleTools(readOnly)` says what a read-only connection is served;
 * - `servedOn(def, 'shared')` says what the hosted address serves instead
 *   of a local-path tool, `servedTo(def, 'user')` what the Ask surface
 *   gets;
 * - `restorable()` says where an irreversible tool needs no go.
 *
 * `mcp/dist` is a build output, not checked in: run `npm run build` in
 * heisenware-cloud/mcp first. The script refuses a missing build and
 * warns when `src/catalog.ts` is newer than it. It never starts the
 * platform.
 *
 * The catalog's own grouping is source comments (`// --- mutation ---`),
 * too coarse for a reader: GROUPS below maps every tool to a group of
 * this page. A tool the map does not name lands under "Other" and is
 * reported, so a new tool shows up instead of disappearing.
 *
 * The page has one generated block between `<!-- generated -->` and
 * `<!-- /generated -->`; the text around it is written by hand and kept.
 *
 * Usage:
 *   node scripts/reference/mcp-tools.mjs [--cloud <path>] [--check]
 * --cloud  the heisenware-cloud checkout (default: ../heisenware-cloud)
 * --check  write nothing; exit 1 when the page is stale
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(DOCS, 'assistant', 'mcp-tools.md')

const args = process.argv.slice(2)
const argAfter = flag => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined)
const CLOUD = path.resolve(argAfter('--cloud') ?? path.join(DOCS, '..', 'heisenware-cloud'))
const CHECK = args.includes('--check')
const MCP = path.join(CLOUD, 'mcp')

const START = '<!-- generated -->'
const END = '<!-- /generated -->'

/* ------------------------------------------------------------------ *
 * The groups of this page, in their order
 * ------------------------------------------------------------------ */

const GROUPS = [
  {
    title: 'The platform',
    lead: 'What is there to build with, and what the machines are doing.',
    tools: [
      'get_platform_law', 'get_deployment_info', 'list_capabilities', 'describe_class',
      'get_connector_guide', 'list_agents', 'get_agent', 'get_agent_log',
      'list_containers', 'get_container_log'
    ]
  },
  {
    title: 'Apps, versions and releases',
    lead: 'An App as a whole: what it is, what it was, and what its users run.',
    tools: [
      'list_apps', 'create_app', 'set_app_identity', 'describe_app', 'check_migration',
      'checkpoint', 'list_checkpoints', 'rollback', 'export_app', 'import_app',
      'list_app_texts', 'translate_app', 'deploy_app', 'delete_entity'
    ]
  },
  {
    title: 'The flow',
    lead: 'Executors on the Flowboard, their addresses, their triggers and the wires between them.',
    tools: [
      'create_executor', 'get_executor', 'set_address', 'set_dynamic_address', 'set_loop',
      'set_input_default', 'add_trigger_source', 'connect', 'disconnect', 'connect_trigger',
      'disconnect_trigger', 'add_extension', 'update_extension', 'delete_extension',
      'set_comment', 'create_section', 'update_section', 'delete_section',
      'create_annotation', 'update_annotation', 'delete_annotation',
      'create_subflow', 'call_subflow', 'set_subflow_timeout'
    ]
  },
  {
    title: 'Variables, endpoints and events',
    lead: "An App's own values, the doors other callers use, and backend subscriptions.",
    tools: [
      'define_variable', 'update_variable', 'delete_variable',
      'define_endpoint', 'update_endpoint', 'delete_endpoint', 'get_app_contract',
      'trigger_endpoint', 'tap_event', 'stop_listening', 'list_registrations', 'end_registration'
    ]
  },
  {
    title: 'Pages and widgets',
    lead: 'What users see: pages, the widgets on them, and the links that carry values.',
    tools: [
      'add_page', 'update_page', 'delete_page', 'reorder_pages', 'move_page',
      'pin_page_props', 'unpin_page_props',
      'list_widget_types', 'get_widget_manifest', 'create_widget', 'get_widget_props',
      'set_widget_props', 'set_widget_geometry', 'restack_widget',
      'pin_widget_props', 'unpin_widget_props', 'group_widgets', 'ungroup_widgets',
      'set_group_bindings', 'set_widget_value_scope',
      'link_widget', 'unlink_widget', 'link_page', 'unlink_page', 'link_action', 'unlink_action'
    ]
  },
  {
    title: 'Navigation and theme',
    lead: "The App's menu and its look.",
    tools: ['pin_navigation_props', 'unpin_navigation_props', 'get_app_theme', 'set_app_theme']
  },
  {
    title: 'The data model',
    lead: "The tables of the workspace's own database.",
    tools: ['get_data_model', 'define_table', 'preview_reshape', 'reshape_data_model', 'adopt_drift']
  },
  {
    title: 'Reading data',
    lead: 'Every database and InfluxDB a flow connected, the files their rows point to, and what an analysis becomes.',
    tools: [
      'list_data_sources', 'describe_data_source', 'query_database', 'query_timeseries',
      'compute_table', 'open_file', 'create_report', 'show_charts'
    ]
  },
  {
    title: 'Files',
    lead: "The workspace's shared files.",
    tools: [
      'list_shared_files', 'read_shared_file', 'write_shared_file',
      'fetch_shared_file', 'upload_shared_file', 'move_shared_files'
    ]
  },
  {
    title: 'Testing and looking',
    lead: 'Starting the App, probing one node, and the eyes.',
    tools: [
      'test_app', 'stop_app', 'invoke_executor', 'get_executor_status', 'read_value',
      'layout_lint', 'screenshot', 'use_app'
    ]
  },
  {
    title: 'Talking to you',
    lead: 'The two tools whose result is not a change but a message.',
    tools: ['show_user', 'report_platform_issue']
  }
]

/* ------------------------------------------------------------------ *
 * Reading the catalog
 * ------------------------------------------------------------------ */

function loadCatalog () {
  const dist = path.join(MCP, 'dist', 'catalog.js')
  if (!fs.existsSync(dist)) {
    console.error(
      `mcp-tools: no built catalog at ${dist}\n` +
      `  run 'npm install && npm run build' in ${MCP} (or use --cloud <path>)`
    )
    process.exit(2)
  }
  const src = path.join(MCP, 'src', 'catalog.ts')
  if (fs.existsSync(src) && fs.statSync(src).mtimeMs > fs.statSync(dist).mtimeMs) {
    console.error(`mcp-tools: WARNING - ${src} is newer than the build; run 'npm run build' in ${MCP}`)
  }
  const require = createRequire(path.join(MCP, 'package.json'))
  const catalog = require(dist)
  const gate = require(path.join(MCP, 'dist', 'gate.js'))
  return { ...catalog, ...gate }
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

const oneLine = text => String(text ?? '').replace(/\s+/g, ' ').trim()

/** Abbreviations that end no sentence. */
const ABBR = /(?:\be\.g|\bi\.e|\betc|\bcf|\bvs|\.\.)\.$/

/** The description's sentences, abbreviations kept whole. */
function sentences (text) {
  const parts = oneLine(text).split(/(?<=[.!?])\s+/)
  const out = []
  for (const part of parts) {
    if (out.length > 0 && (ABBR.test(out.at(-1)) || !/^[A-Z(`'"]/.test(part))) {
      out[out.length - 1] += ' ' + part
    } else out.push(part)
  }
  return out
}

/** The first sentence or two of a tool's description, bounded. */
function lead (text, budget = 240, hardCap = 260) {
  const list = sentences(text)
  let acc = list[0] ?? ''
  for (let i = 1; i < list.length; i++) {
    if ((acc + ' ' + list[i]).length > budget) break
    acc += ' ' + list[i]
  }
  if (acc.length > hardCap) {
    // cut at the last clause boundary of the sentence, else between words
    const head = acc.slice(0, hardCap)
    const clause = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '), head.lastIndexOf(' - '))
    acc = clause > hardCap * 0.5
      ? head.slice(0, clause)
      : head.replace(/[\s,;:-]*\S*$/, '')
    acc += '…'
  }
  return acc
}

/**
 * A table cell: Markdown's own characters out of the way. A description
 * may hold a fence (```mermaid) or an unpaired backtick, which would eat
 * the rest of the row, and a link or image (![](/shared/uploads/x.png)),
 * which the link check would then follow.
 */
function cell (text) {
  let out = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/`{2,}/g, run => '\\`'.repeat(run.length))
    // no `](` left anywhere: it is what a link is found by
    .replace(/\\\]\(/g, '\\]\\(')
  if (((out.match(/(?<!\\)`/g) ?? []).length) % 2 === 1) out = out.replace(/(?<!\\)`/g, '\\`')
  return out
}

const table = rows => [
  '| ' + rows[0].join(' | ') + ' |',
  '| ' + rows[0].map(() => '---').join(' | ') + ' |',
  ...rows.slice(1).map(row => '| ' + row.join(' | ') + ' |')
]

/** The markers a tool carries, from the catalog's flags. */
function markers (def, api) {
  const flags = []
  if (def.mutating) flags.push('`write`')
  if (def.destructive) {
    const partly = api.restorable(def.name, { className: 'Executor' }) !== api.restorable(def.name, { className: 'Application' })
    flags.push(partly ? '`go`\\*' : '`go`')
  }
  if (def.localFiles && api.servedOn(def, 'shared') !== def) flags.push('`files`')
  if (api.servedTo(def, 'user') !== undefined) flags.push('`ask`')
  return flags.join(' ')
}

function render (api) {
  const byName = new Map(api.TOOLS.map(def => [def.name, def]))
  const assigned = new Set()
  const out = []

  const total = api.visibleTools(false).length
  const reading = api.visibleTools(true).length
  out.push(
    `The server serves ${total} tools. A read-only connection serves the ${reading} that only read; ` +
    'the others are not offered at all.',
    '',
    'The last column:',
    '',
    '* `write`: changes something, so a read-only connection does not offer it.',
    "* `go`: needs your explicit go, as `confirm: true` from your own AI client or the approval card of the built-in assistant.",
    '* `files`: hands paths on the machine the server runs on. The local MCP server does that; the ' +
      "workspace's MCP address serves the same tool with the workspace's shared files instead.",
    '* `ask`: an App user gets this tool too, through [Ask](../app-manager/ask.md).',
    '',
    '`go`\\* marks a tool that needs the go only for what a rollback cannot restore: `delete_entity` ' +
      'needs it for a whole App, not for an executor, a widget or a page.'
  )

  for (const group of GROUPS) {
    const rows = [['Tool', 'What it does', 'Marks']]
    for (const name of group.tools) {
      const def = byName.get(name)
      if (!def) {
        console.error(`mcp-tools: WARNING - the catalog has no tool '${name}' (group "${group.title}")`)
        continue
      }
      if (assigned.has(name)) {
        console.error(`mcp-tools: WARNING - '${name}' is in two groups`)
        continue
      }
      assigned.add(name)
      rows.push([`\`${name}\``, cell(lead(def.description)), markers(def, api)])
    }
    out.push('', `## ${group.title}`, '', group.lead, '', ...table(rows))
  }

  const rest = api.TOOLS.filter(def => !assigned.has(def.name))
  if (rest.length > 0) {
    console.error(`mcp-tools: WARNING - not in any group: ${rest.map(d => d.name).join(', ')}`)
    const rows = [['Tool', 'What it does', 'Marks']]
    for (const def of rest) rows.push([`\`${def.name}\``, cell(lead(def.description)), markers(def, api)])
    out.push('', '## Other', '', 'Tools this page has not sorted yet.', '', ...table(rows))
  }

  // The Ask surface (catalog.ts servedTo): the same tool, or its own
  const askRows = [['Tool', 'At the user seat']]
  for (const def of api.TOOLS) {
    const served = api.servedTo(def, 'user')
    if (served === undefined) continue
    const own = served.description !== def.description
    const note = own ? cell(lead(served.description, 180, 200)) : 'The same tool.'
    askRows.push([`\`${def.name}\``, served.approval ? `${note} Asks the user first.` : note])
  }
  out.push(
    '',
    '## The Ask surface',
    '',
    'An App user who asks in the App, or from their own AI client, is served ' +
      `${askRows.length - 1} of these tools: the reading ones as they are, and a few in a form of ` +
      'their own, for one App and its data. [Ask](../app-manager/ask.md) says what that reach is.',
    '',
    ...table(askRows)
  )
  return out.join('\n')
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

function page (existing, block) {
  const head = [
    '---',
    'description: >-',
    '  Every tool the MCP server serves: what it does, what it changes and what needs your go',
    '---',
    '',
    '# MCP tools',
    ''
  ].join('\n')
  let before = '\nThe tools the platform serves to an AI.\n\n'
  let after = '\n'
  if (existing && existing.includes(START) && existing.includes(END)) {
    const body = existing.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*# .*\n/, '')
    before = body.slice(0, body.indexOf(START))
    after = body.slice(body.indexOf(END) + END.length)
  }
  return head + before + block + after
}

const api = loadCatalog()
const block = [
  START,
  '<!-- Generated from heisenware-cloud/mcp (src/catalog.ts, built to dist/). Regenerate with scripts/reference/mcp-tools.mjs; edit outside this block only. -->',
  '',
  render(api),
  '',
  END
].join('\n')
const existing = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null
const next = page(existing, block)
if (CHECK) {
  if (existing !== next) {
    console.error('mcp-tools: assistant/mcp-tools.md is stale; run scripts/reference/mcp-tools.mjs')
    process.exit(1)
  }
  console.log('mcp-tools: up to date')
} else if (existing !== next) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, next)
  console.log(`mcp-tools: wrote assistant/mcp-tools.md (${api.TOOLS.length} tools)`)
} else {
  console.log('mcp-tools: up to date')
}
