# Insane Mod — Chrome Extension

Elite MooMoo.io mod with weapon-aware AI, bots, packet proxy, and a full in-game menu.

---

## Installation

### 1. Build the icons (one-time)

```bash
cd extension
npm install canvas --save-dev
node generate_icons.js
```

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder inside this project
5. The **Insane Mod ⚡** icon will appear in your toolbar

### 3. Play

1. Open [moomoo.io](https://moomoo.io)
2. The mod loads automatically — press **Esc** to open the in-game menu
3. Click the **⚡** toolbar icon to open the popup for bot controls

---

## File Structure

```
extension/
├── manifest.json       Chrome MV3 manifest
├── content.js          Injects mod.js into the page context
├── mod.js              Full mod code (runs in page context)
├── background.js       Service worker — tab tracking, context menus
├── popup.html          Toolbar popup UI
├── popup.js            Popup logic — stats, bot controls, page comms
├── generate_icons.js   Node script to build PNG icons
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Features

### ⚔️ Combat
- Weapon-aware pathfinder (dagger rushes, polearm kites, bow strafe-kites)
- AutoInsta with configurable frame windows
- Avoid Functions — wall-slide around spikes/traps
- Auto-break enemy structures using the best available weapon
- CxC Wings auto-correction

### 👁️ Visuals
- Tracers toward targets
- Camera zoom presets
- Health bars, name tags, equalizer wave, snow effect

### 🏗️ Build
- Auto Replace / Auto Place / Pre Place
- Anti Trap, Weapon Grinder

### 🎚️ Range
- Live sliders for equalizer, player render distance, night, grids

### 🤖 Bots
- Real WebSocket bots on the **same shard** as the player
- Weapon-aware AI: dagger rush · sword strafe · polearm kite · bow kite
- Configurable hat, aggro radius, follow/attack/chat toggles
- Auto-respawn on death
- Live stat display: Active / Alive / Bot Kills
- **Proxy bypass** — bots use `_rawWsSend` to skip PACKET_MAP remapping

### ⚙️ Misc
- Smooth Health, Assassin Gear, Wheel Zoom, Map Sync
- Auto-Upgrade, Kill Chat, Auto-Buy, Real Dir configs

---

## Proxy Architecture

MooMoo.io uses **obfuscated packet type strings** that change with updates.  
The mod maintains a `PACKET_MAP` that remaps human-readable types to the current obfuscated ones:

```
"a" → "9"   (move)
"d" → "F"   (attack)
"G" → "z"   (weapon select)
```

### How it works

1. **`_rawWsSend`** — captured at script load time, before any proxy exists
2. **`installPacketProxy()`** — deferred until `window.msgpack` is available, then wraps `WebSocket.prototype.send` with the PACKET_MAP remapper
3. **Bot `pkt()`** — calls `_rawWsSend.call(ws, buf)` directly, bypassing all remapping so bots send correct unobfuscated types to the server

### Why bots were invisible before

The old userscript applied `WebSocket.prototype.send` overrides to **all** sockets including bot sockets. Bot packets were getting type-remapped (`"a"` → `"9"`, `"d"` → `"F"`) before the server received them — the server rejected the garbage types and disconnected the bot silently.

The extension version captures the truly raw send before any proxy exists and uses it exclusively for bot traffic.

---

## Updating the PACKET_MAP

When MooMoo updates their packet obfuscation, edit the top of `mod.js`:

```js
const PACKET_MAP = {
    "a": "9",   // move direction
    "d": "F",   // attack swing
    "G": "z",   // weapon/build select
    // add new mappings here
};
```

---

## Credits

- Mod by **wat** — [YouTube](https://www.youtube.com/@wat839)
- Credits to **Morning Star** — [YouTube](https://www.youtube.com/channel/UCy8bEUAgqfr3VSsuAun-oZA)