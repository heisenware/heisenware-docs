#!/usr/bin/env node
/**
 * Generates the block of reference/older-apps.md from the migration
 * registry in heisenware-cloud (mcp/src/core/migrationRules.json).
 *
 * That registry is the platform's single source of truth for what an App
 * built on an older version has to change: `check_migration` applies it to
 * one App's records, `describe_app` says in one line that an App leans on
 * it, and this page is the same list for people. A rule is added there when
 * a change breaks what older Apps do, never as a "was" in the platform law
 * - so this page must never be written by hand either.
 *
 * Which rules the page carries: those in force at the release the docs
 * describe. A rule retires at `retiresAt`, and the six that retire at
 * `v93-0` changed during the v93 beta phase only - a v92 App never had that
 * behaviour, and v93 as it ships no longer has the rule. `--all` renders
 * them too, for a beta reader.
 *
 * `refs` (issue numbers) is deliberately left out: it is internal.
 *
 * Usage:
 *   node scripts/reference/migrations.mjs [--cloud <path>] [--check] [--all]
 * --cloud  the heisenware-cloud checkout (default: ../heisenware-cloud)
 * --check  write nothing; exit 1 when the page is stale
 * --all    include the rules that retire at this release (beta phase)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(DOCS, 'reference', 'older-apps.md')

const args = process.argv.slice(2)
const argAfter = flag => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined)
const CLOUD = path.resolve(argAfter('--cloud') ?? path.join(DOCS, '..', 'heisenware-cloud'))
const CHECK = args.includes('--check')
const ALL = args.includes('--all')
const SOURCE = path.join(CLOUD, 'mcp', 'src', 'core', 'migrationRules.json')

const START = '<!-- generated -->'
const END = '<!-- /generated -->'

/** The release this documentation describes; rules retiring here are spent. */
const RELEASE = 'v93-0'

/**
 * The areas in the order a reader meets them, with the heading each one
 * gets. The registry's own `area` values are engineering words; a reader
 * looks for the part of the App that breaks.
 */
const AREAS = [
  ['engine', 'Flows, triggers and values'],
  ['widgets', 'Widgets and pages'],
  ['database', 'Databases'],
  ['timeSeries', 'Time series'],
  ['files', 'Files'],
  ['utilities', 'Utility functions'],
  ['connectors', 'Connectors']
]

function render (registry) {
  const rules = registry.rules.filter(r => ALL || r.retiresAt !== RELEASE)
  const out = [
    START,
    '<!-- Source: heisenware-cloud/mcp/src/core/migrationRules.json.',
    '     Regenerate with scripts/reference/migrations.mjs; edit outside this block only. -->',
    ''
  ]

  const seen = new Set()
  for (const [area, heading] of AREAS) {
    const mine = rules.filter(r => r.area === area)
    if (!mine.length) continue
    mine.forEach(r => seen.add(r.id))
    out.push(`## ${heading}`, '')
    for (const r of mine) {
      // `was` and `is` are whole sentences; the pair reads as one item
      out.push(`* **Was:** ${r.was}`)
      out.push(`  **Now:** ${r.is}`)
      if (!r.recognise) {
        out.push('  *The records cannot show this one: check it yourself.*')
      }
      out.push('')
    }
  }

  const rest = rules.filter(r => !seen.has(r.id))
  if (rest.length) {
    out.push('## Other', '')
    for (const r of rest) {
      out.push(`* **Was:** ${r.was}`, `  **Now:** ${r.is}`, '')
    }
    console.warn(`migrations: ${rest.length} rule(s) in an area the script does not name: ${[...new Set(rest.map(r => r.area))].join(', ')}`)
  }

  out.push(END)
  return out.join('\n')
}

function main () {
  if (!fs.existsSync(SOURCE)) {
    console.error(`migrations: no registry at ${SOURCE} (use --cloud <path>)`)
    process.exit(2)
  }
  const registry = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))
  const page = fs.readFileSync(OUT, 'utf8')
  const from = page.indexOf(START)
  const to = page.indexOf(END)
  if (from < 0 || to < 0) {
    console.error(`migrations: ${path.relative(DOCS, OUT)} has no ${START} … ${END} block`)
    process.exit(2)
  }
  const next = page.slice(0, from) + render(registry) + page.slice(to + END.length)
  if (CHECK) {
    if (next !== page) {
      console.error(`migrations: ${path.relative(DOCS, OUT)} is stale; run scripts/reference/migrations.mjs`)
      process.exit(1)
    }
    console.log('migrations: up to date')
    return
  }
  fs.writeFileSync(OUT, next)
  const kept = registry.rules.filter(r => ALL || r.retiresAt !== RELEASE).length
  console.log(`migrations: wrote ${path.relative(DOCS, OUT)} (${kept} of ${registry.rules.length} rules)`)
}

main()
