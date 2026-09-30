#!/usr/bin/env node
/**
 * Generates reference/glossary.md from the glossary in heisenware-cloud
 * (docs/glossary.md) - the shared vocabulary of the platform law, the
 * assistant, the UI and these docs.
 *
 * The page keeps what readers need: every term with its meaning, and the
 * synonyms that are fine ("Also called"). It leaves out what only writers
 * need: the writing conventions (section 0), the words to avoid (*not:*),
 * identifiers (*code:*), screen labels (*UI:*) and notes on where a
 * synonym may be used.
 *
 * The page has one generated block between `<!-- generated -->` and
 * `<!-- /generated -->`; the text around it is written by hand and kept.
 *
 * Usage:
 *   node scripts/reference/glossary.mjs [--cloud <path>] [--check]
 * --cloud  the heisenware-cloud checkout (default: ../heisenware-cloud)
 * --check  write nothing; exit 1 when the page is stale
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(DOCS, 'reference', 'glossary.md')

const args = process.argv.slice(2)
const argAfter = flag => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined)
const CLOUD = path.resolve(argAfter('--cloud') ?? path.join(DOCS, '..', 'heisenware-cloud'))
const CHECK = args.includes('--check')
const SOURCE = path.join(CLOUD, 'docs', 'glossary.md')

const START = '<!-- generated -->'
const END = '<!-- /generated -->'

/** "Manager (in running text, once …), client scope (law and code, …)" -> ['Manager'] */
function alsoCalled (list) {
  const items = []
  let depth = 0
  let current = ''
  for (const ch of list) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      items.push(current)
      current = ''
    } else current += ch
  }
  items.push(current)
  return items
    .map(item => item.trim())
    .filter(item => item && !/\((?:[^)]*\b(?:never|law|code)\b)[^)]*\)/.test(item))
    .map(item => item.replace(/\s*\([^)]*\)/g, '').trim())
    .filter(Boolean)
}

function render (source) {
  const lines = source.split('\n')
  const out = []
  let section = null
  let inEntry = false
  for (const line of lines) {
    const heading = line.match(/^## (\d+)\.\s+(.*)$/)
    if (heading) {
      section = Number(heading[1])
      inEntry = false
      if (section > 0) out.push('', `## ${heading[2].replace(/^./, c => c.toUpperCase())}`, '')
      continue
    }
    if (!section || line.startsWith('---')) continue
    if (/^\*\*[^*]+\*\*:/.test(line)) {
      inEntry = true
      out.push('', line)
      continue
    }
    if (!inEntry) continue
    const meta = line.match(/^- \*(also|not|code|UI):\*\s*(.*)$/)
    if (meta) {
      if (meta[1] === 'also') {
        const names = alsoCalled(meta[2])
        if (names.length) out.push(`*Also called:* ${names.join(', ')}.`)
      }
      continue
    }
    if (line.trim() === 'Then:') continue // introduces the writer's details after a sub-list
    if (line.trim()) out.push(line)
    else if (out.at(-1) !== '') out.push('')
  }
  // one blank line between entries, none doubled
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function page (existing, block) {
  const head = [
    '---',
    'description: >-',
    '  The words Heisenware uses in the App Manager, the App Builder, the App Player, the assistant and these docs',
    '---',
    '',
    '# Glossary',
    ''
  ].join('\n')
  let before = '\nThese are the words Heisenware uses everywhere: in the App Manager, the App Builder and the App Player, in what the assistant says, and on these pages. Each term has one meaning, and the same thing always has the same name.\n\n'
  let after = '\n'
  if (existing && existing.includes(START) && existing.includes(END)) {
    const body = existing.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^\s*# .*\n/, '')
    before = body.slice(0, body.indexOf(START))
    after = body.slice(body.indexOf(END) + END.length)
  }
  return head + before + block + after
}

if (!fs.existsSync(SOURCE)) {
  console.error(`glossary: no glossary at ${SOURCE} (use --cloud <path>)`)
  process.exit(2)
}
const block = [
  START,
  '<!-- Generated from heisenware-cloud/docs/glossary.md. Regenerate with scripts/reference/glossary.mjs; edit outside this block only. -->',
  '',
  render(fs.readFileSync(SOURCE, 'utf8')),
  '',
  END
].join('\n')
const existing = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null
const next = page(existing, block)
if (CHECK) {
  if (existing !== next) {
    console.error('glossary: reference/glossary.md is stale; run scripts/reference/glossary.mjs')
    process.exit(1)
  }
  console.log('glossary: up to date')
} else if (existing !== next) {
  fs.writeFileSync(OUT, next)
  console.log('glossary: wrote reference/glossary.md')
} else {
  console.log('glossary: up to date')
}
