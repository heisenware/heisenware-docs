#!/usr/bin/env node
// Crops a PNG to a box, with an optional margin around it:
//   node crop.js <in.png> <out.png> <x> <y> <width> <height> [margin]
// Boxes come from layout_lint in design px; the MCP screenshot of the
// same screen has the same size, so they apply unchanged.
const fs = require('fs')
const { PNG } = require('pngjs')

// `--trim [left]` instead of a box: cut the empty tail off a screen shot.
// A manager or builder screen is as tall as its viewport, so a short page
// leaves a band of background under the content. The band is found in the
// CONTENT column only (right of the sidebar, default x >= 290), because the
// sidebar runs the full height in its own colour and would never look empty.
function trimmed (src, left, margin) {
  const bg = []
  for (let c = 0; c < 4; c++) bg.push(src.data[((src.width * (src.height - 1) + src.width - 8) << 2) + c])
  const differs = (x, y) => {
    const i = ((src.width * y + x) << 2)
    return Math.abs(src.data[i] - bg[0]) > 6 ||
           Math.abs(src.data[i + 1] - bg[1]) > 6 ||
           Math.abs(src.data[i + 2] - bg[2]) > 6
  }
  let last = 0
  for (let y = 0; y < src.height; y++) {
    for (let x = left; x < src.width - 4; x += 3) {
      if (differs(x, y)) { last = y; break }
    }
  }
  return Math.min(src.height, last + margin)
}

const argv = process.argv.slice(2)

// `--mask x,y,w,h` paints a rectangle in the colour just left of it: the
// way a member's name or address is kept out of a screenshot without
// cutting away the bar it sits in.
if (argv.includes('--mask')) {
  const i = argv.indexOf('--mask')
  const [mx, my, mw, mh] = argv[i + 1].split(',').map(Number)
  const [inp, outp] = argv.filter((a, j) => !a.startsWith('--') && j !== i + 1)
  const src = PNG.sync.read(fs.readFileSync(inp))
  const at = (x, y) => (src.width * y + x) << 2
  // the bar's real background is the colour that occurs most across the
  // rows the mask covers; sampling one neighbouring pixel picks up a
  // border or a hover tint and leaves a visible patch
  const tally = new Map()
  for (let y = my; y < my + mh && y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const i2 = at(x, y)
      const key = `${src.data[i2]},${src.data[i2 + 1]},${src.data[i2 + 2]}`
      tally.set(key, (tally.get(key) ?? 0) + 1)
    }
  }
  if (!tally.size) {
    console.error(`${inp}: the mask lies outside the image (${src.width}x${src.height})`)
    process.exit(2)
  }
  const best = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0]
  const fill = [...best.split(',').map(Number), 255]
  for (let y = my; y < my + mh && y < src.height; y++) {
    for (let x = mx; x < mx + mw && x < src.width; x++) {
      const i2 = at(x, y)
      for (let c = 0; c < 4; c++) src.data[i2 + c] = fill[c]
    }
  }
  fs.writeFileSync(outp, PNG.sync.write(src))
  console.log(`${outp}: masked ${mw}x${mh} at ${mx},${my}`)
  process.exit(0)
}

if (argv.includes('--trim')) {
  const i = argv.indexOf('--trim')
  const left = Number(argv[i + 1]) || 290
  const [inp, outp] = argv.filter(a => !a.startsWith('--') && a !== String(left))
  const src = PNG.sync.read(fs.readFileSync(inp))
  const height = trimmed(src, left, 24)
  const out = new PNG({ width: src.width, height })
  PNG.bitblt(src, out, 0, 0, src.width, height, 0, 0)
  fs.writeFileSync(outp, PNG.sync.write(out))
  console.log(`${outp}: ${src.width}x${height} (was ${src.width}x${src.height})`)
  process.exit(0)
}

const [input, output, ...nums] = argv
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
