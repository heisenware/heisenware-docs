#!/usr/bin/env node
// Crops and halves a recorded GIF: a full-window clip is sharp but heavy and
// its text is small on a docs page.
//   node shrink.js <in.gif> <out.gif> [x y width height] [--scale 0.5] [--every 2]
// `--every N` keeps every Nth frame and lengthens it to match, which is what
// makes a long clip small. `--delay ms` overrides the frame delay instead,
// turning a run that took minutes into a time-lapse of a few seconds.
// gifsicle, when present, optimizes the result.
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const argv = process.argv.slice(2)
const scaleAt = argv.indexOf('--scale')
const scale = scaleAt >= 0 ? Number(argv[scaleAt + 1]) : 0.5
const everyAt = argv.indexOf('--every')
const every = everyAt >= 0 ? Number(argv[everyAt + 1]) : 1
const delayAt = argv.indexOf('--delay')
const delay = delayAt >= 0 ? Number(argv[delayAt + 1]) : 0
const rest = argv.filter((a, i) => !a.startsWith('--') && i !== scaleAt + 1 && i !== everyAt + 1 && i !== delayAt + 1)
const [input, output, ...box] = rest
if (!input || !output) {
  console.error('usage: node shrink.js <in.gif> <out.gif> [x y width height] [--scale 0.5]')
  process.exit(2)
}
const py = `
from PIL import Image, ImageSequence
im = Image.open(${JSON.stringify(input)})
box = ${box.length === 4 ? `(${box[0]}, ${box[1]}, ${Number(box[0]) + Number(box[2])}, ${Number(box[1]) + Number(box[3])})` : 'None'}
frames, durations = [], []
for i, f in enumerate(ImageSequence.Iterator(im)):
    if i % ${every}: continue
    durations.append(${delay} or f.info.get('duration', 100) * ${every})
    g = f.convert('RGB')
    if box: g = g.crop(box)
    g = g.resize((max(1, int(g.width * ${scale})), max(1, int(g.height * ${scale}))), Image.LANCZOS)
    frames.append(g.convert('P', palette=Image.ADAPTIVE, colors=256))
frames[0].save(${JSON.stringify(output)}, save_all=True, append_images=frames[1:],
               duration=durations, loop=0, optimize=True, disposal=2)
print(frames[0].width, frames[0].height, len(frames))
`
const out = execFileSync('python3', ['-c', py], { encoding: 'utf8' }).trim()
try {
  execFileSync('gifsicle', ['-O3', '--lossy=70', '--batch', output], { stdio: 'ignore' })
} catch {}
const [w, h, n] = out.split(/\s+/)
console.log(`${path.basename(output)}: ${w}x${h}, ${n} frames, ${(fs.statSync(output).size / 1e6).toFixed(2)} MB`)
