#!/usr/bin/env node
// Crops a PNG to a box, with an optional margin around it:
//   node crop.js <in.png> <out.png> <x> <y> <width> <height> [margin]
// Boxes come from layout_lint in design px; the MCP screenshot of the
// same screen has the same size, so they apply unchanged.
const fs = require('fs')
const { PNG } = require('pngjs')

const [input, output, ...nums] = process.argv.slice(2)
const [x, y, w, h, margin = 0] = nums.map(Number)
if (!input || !output || [x, y, w, h].some(Number.isNaN)) {
  console.error('usage: node crop.js <in.png> <out.png> <x> <y> <width> <height> [margin]')
  process.exit(2)
}

const src = PNG.sync.read(fs.readFileSync(input))
const x0 = Math.max(0, x - margin)
const y0 = Math.max(0, y - margin)
const x1 = Math.min(src.width, x + w + margin)
const y1 = Math.min(src.height, y + h + margin)
const out = new PNG({ width: x1 - x0, height: y1 - y0 })
PNG.bitblt(src, out, x0, y0, out.width, out.height, 0, 0)
fs.writeFileSync(output, PNG.sync.write(out))
console.log(`${output}: ${out.width}x${out.height}`)
