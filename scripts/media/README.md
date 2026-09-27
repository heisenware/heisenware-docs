# Recording docs media

The screenshots and GIFs under `.gitbook/assets` can be recorded from a running
platform instead of by hand. Each asset is a *storyboard*: a small script that
drives the manager, builder or player through Playwright while a recorder
captures frames. Re-running a storyboard after a release refreshes its asset.

GitBook does not see this folder: it only renders pages listed in
`SUMMARY.md`, and `scripts/check-docs.py` skips `scripts/` when it looks for
orphaned assets.

## Setup

```sh
cd scripts/media
npm install                      # also downloads the matching Chromium
cp .env.example .env             # fill in the account used for recording
```

The stack must be reachable at `HW_BASE_URL` (default `https://localhost`,
self-signed certificates are fine). If Chromium complains about missing
shared libraries, run `sudo npx playwright install-deps chromium` once
(`sudo env "PATH=$PATH" npx ...` when Node comes from nvm).

Optional packages:

* `gifsicle`: when it is on the `PATH`, GIFs get an `-O3` pass (roughly an
  eighth of the size).
* `fonts-roboto`: the builder and the player ship Roboto themselves, but
  where the manager falls back to the system font, `fonts.conf` points
  Chromium at Roboto and, failing that, Liberation Sans.

## Usage

```sh
node record.js --list                     # storyboards and what they produce
node record.js sign-in                    # record one into .gitbook/assets
node record.js sign-in --out out          # ... or somewhere else (out/ is git-ignored)
node record.js --all                      # refresh everything
node record.js drag-widget --frames       # dump every frame as PNG for debugging
```

## Writing a storyboard

Drop a module into `storyboards/`:

```js
module.exports = {
  name: 'drag-widget-to-page',              // -> drag-widget-to-page.gif
  description: 'Drags a button widget from the palette onto the page',
  login: true,                              // start signed in (credentials from .env)
  viewport: { width: 1280, height: 800 },   // optional, this is the default

  async run ({ page, m, env }) {
    await page.goto(`${env.baseUrl}/builder/...`, { waitUntil: 'networkidle' })
    await m.cursorAt([900, 300])            // park the pointer, then start recording
    await m.hold(800)
    await m.moveTo(page.getByText('Button'))
    await m.dragTo(page.locator('.page-canvas'))
    await m.hold(1500)
  }
}
```

`m` is the recorder (`lib.js`). What it offers:

| call | effect |
| --- | --- |
| `hold(ms)` / `frame(ms)` | capture one frame and hold it that long |
| `cursorAt(target)` | place the pointer without animating |
| `moveTo(target, { steps, delay })` | eased glide, one frame per step |
| `click(target?)` | move there, press (ring shows), release |
| `dragTo(target, { steps, delay, settle })` | press, arm the drag with a small nudge, glide, drop |
| `type(text, { delay })` | type into the focused element |
| `focus(target, padding)` / `unfocus()` | crop every following capture to that element or box |
| `still(name, { cursor })` | a PNG of its own, pointer hidden unless asked for |

A `target` is a Playwright locator, a `{ x, y }` point or an `[x, y]` pair.
More than one frame makes a GIF, a single frame makes `<name>.png`, and each
`still()` makes a PNG regardless.

Tips

* Keep the whole clip under ten seconds; GIFs grow with every frame. Cropping
  with `focus()` helps more than anything else.
* Start with a `hold()` so the viewer sees the initial state, end with a
  longer one so the result registers before the loop restarts.
* Drag-and-drop in the builder is driven by `react-dnd`, `@hello-pangea/dnd`
  and `@xyflow/react`; all three respond to the mouse-based `dragTo`. If a
  drag does not arm, raise `steps` so the first movement is slower.
