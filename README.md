<div align="center">

# Armony Flow

**Turn any screen into a living picture frame.**
High-resolution landscapes that drift and dissolve into each other, over a soundtrack of free lofi, jazz, piano, classical or nature sounds.

[**▶ Open Armony Flow**](https://asaninc.github.io/armony-flow/)

![Armony Flow showing an aerial mountain valley in full screen, with minimal playback controls in the corner](docs/frame.jpg)

</div>

## What it is

Armony Flow is a full-screen ambient web app. Open it on a TV, a monitor you're not using, or an iPad on a stand, press start, and let it run. Each photo stays on screen for about 25 seconds, with a slow zoom and pan (the Ken Burns effect). Then it crossfades into the next one. The controls and the cursor fade away when the mouse stops moving, so all you see is the picture.

It has no account, no ads, no API keys and no build step. It's three static files.

## Features

- 🖼 **Museum-grade photos**: only *Featured Pictures* from Wikimedia Commons, which are images the Commons community has voted among the best on the site. Photos are filtered to landscape orientation and at least 3000 px wide, and are served at 1920 or 3840 px depending on your screen.
- 🎬 **Smooth motion**: slow zoom and pan in random directions, and 3-second crossfades. The next image is downloaded and decoded before the transition starts, so the fade doesn't stutter.
- 🎵 **Five music styles**: Lofi, Jazz, Piano, Classical and Nature. All tracks are Creative Commons or public domain, streamed from the Internet Archive.
- 🏔 **Seven photo styles**: Landscapes, Mountains, Water, Forests, Countryside, Cities, or Everything.
- 📃 **Playlist**: see what's playing, jump to any track, skip forward or back.
- 🌍 **English and Portuguese**: picked automatically from your browser language and time zone, and can be switched at any time.
- 🖥 **Made to run all day**: keeps the screen awake, hides the controls when idle, and works with media keys, Bluetooth headphones and the iPad lock screen.
- 📱 **Works on phones and tablets**: covers the whole screen on iPad and iPhone, notch and rounded corners included.

![The settings panel with photo style, music style, language and the playlist](docs/panel.jpg)

## Controls

| Button | Keyboard | What it does |
|---|---|---|
| ⏮ | `B` | Previous track (restarts the current one if it has played for more than 3 s) |
| ⏯ | `Space` | Pause or resume both the photos and the music |
| ⏭ | `N` | Next track |
| ☰ | `P` | Open the settings panel: photo style, music style, language, playlist |
| 🔊 | `M` | Mute / unmute |
| ⛶ | `F` | Full screen |
| | `→` | Next photo |

Your choices of photo style, music style, language and mute are remembered on each device.

> **Tip for iPad and iPhone:** in Safari, tap **Share → Add to Home Screen**. When you open Armony Flow from that icon it runs with no browser bars at all, which works best for a picture frame.

## Where the content comes from

Nothing is hosted in this repository. Photos and music are loaded directly from two open archives:

| | Source | License |
|---|---|---|
| Photos | [Wikimedia Commons: Featured pictures](https://commons.wikimedia.org/wiki/Commons:Featured_pictures) | Mostly CC BY-SA, some CC BY or public domain |
| Lofi | Chillhop Music, Loyalty Freak Music and others | CC0, CC BY, CC BY-NC, CC BY-NC-ND |
| Jazz | ProleteR, Kova, Boogie Belgique | CC BY-NC-ND 3.0 |
| Piano | Fabrizio Paterlini, Lee Rosevere, Candlegravity, Emil Davydov, Abigail Press | CC BY-NC-ND / BY-NC-SA / BY-ND |
| Classical | [Musopen](https://musopen.org): Chopin's complete works, plus symphonies | CC0, CC BY-SA 3.0 |
| Nature | Rain, ocean and bird recordings | CC0 |

Most of these licenses require attribution, so the photographer, license and current track are always shown in the corner, each linking to its original page. **Several music albums are licensed for non-commercial use only (NC).** If you fork this for a commercial product, remove those items from `MUSIC_STYLES` in `app.js`.

## Run it locally

Any static file server will do:

```bash
git clone https://github.com/asanInc/armony-flow.git
cd armony-flow
python3 -m http.server 8000
# open http://localhost:8000
```

To deploy, push to GitHub Pages, Cloudflare Pages, Netlify or any other static host. There's nothing to build.

## Make it yours

Every style is a short list at the top of [`app.js`](app.js).

**Add a photo style** by listing one or more Wikimedia Commons categories named `Category:Featured_pictures_of_<name>`:

```js
const PHOTO_STYLES = {
  // ...
  islands: { label: { pt: 'Ilhas', en: 'Islands' }, categories: ['islands', 'coasts'] },
};
```

**Add a music style** by listing [Internet Archive](https://archive.org) item identifiers (the part after `/details/` in the URL). Every MP3 in those items goes into the playlist:

```js
const MUSIC_STYLES = {
  // ...
  ambient: { label: 'Ambient', items: ['some-archive-item', 'another-one'] },
};
```

The slide duration, crossfade time, idle delay and default volume live in `CONFIG`.

## How it works

Armony Flow is plain HTML, CSS and JavaScript, with no framework and no dependencies. A few details that matter for something meant to run for hours:

- **Images are decoded before they're shown.** The `<img>` that goes on screen is the same element that was preloaded and `decode()`d, so the browser never has to decode a large JPEG in the middle of a crossfade.
- **Animations run on the GPU.** The zoom is a Web Animations API transform, and the crossfade is an opacity transition, so both run on the compositor. A tiny `rotate(0.01deg)` stops Firefox from snapping the slow-moving layer to whole pixels, which would otherwise make the motion look jittery.
- **Nothing expensive sits over the animation.** The controls use `visibility: hidden` when idle rather than only `opacity: 0`. The blur effect exists only while the settings panel is open.
- **Only one tab plays at a time.** A `BroadcastChannel` pauses other open copies of the app, so audio never doubles up.
- **Photos start fast.** The first page of a category is enough to start. The rest loads in the background and is shuffled in ahead of the current photo.

```
index.html   markup and controls
style.css    layout, transitions, panel
app.js       photos, music, playlist, i18n, controls
docs/        screenshots for this README
```

## Credits

- Photos by the many photographers of [Wikimedia Commons](https://commons.wikimedia.org). The photo in the screenshots is *ARG-2016-Aerial-Tierra del Fuego (Ushuaia)–Valle Carbajal 01* by Godot13, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Music by the artists listed above, via the [Internet Archive](https://archive.org).
- Built with [Claude Code](https://claude.com/claude-code).
