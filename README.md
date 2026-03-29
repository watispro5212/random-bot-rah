# Nexus Protocol

<div align="center">

**Production-grade Discord bot — sharded runtime, MongoDB persistence, persistent blacklist, companion web + API.**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-BSL--Attribution-FF4444?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-6.0.0-00FFCC?style=for-the-badge)](changelog.html)

</div>

---

## Overview

Nexus Protocol is a **ShardingManager**-driven Discord.js **v14** bot backed by **MongoDB** (economy, guild config, **global blacklist**). Features include credits, quests, casino, XP/rank cards, moderation, tickets, verification, automod hooks, starboard, audit logging, and owner tooling. A **companion website** and **Express** JSON API ship in the same repo.

### v6 highlights

| Area | What changed |
|------|----------------|
| **Blacklist** | Owner `/blacklist` actions now **persist** in MongoDB (`BlacklistEntry`); all shards hydrate from DB on **ready**. |
| **Operations** | Tuned MongoDB driver options (`serverSelectionTimeoutMS`, `maxPoolSize`); shard **error** logging; explicit **respawn** on the manager. |
| **Commands** | New **`/uptime`** — process uptime, client session, gateway ping, shard layout, build version. |
| **Logging** | Economy manager errors route through the shared **logger** instead of raw `console`. |

## Requirements

- **Node.js** 18+  
- **MongoDB** (Atlas or self-hosted) — required for full functionality  
- **Discord** application: bot token, **Message Content Intent** if your features need it, **applications.commands** scope for slash commands  

## Quick start

```bash
git clone https://github.com/watispro5212/shiny-giigles.git
cd shiny-giigles
npm install
cp .env.example .env
# TOKEN, DISCORD_CLIENT_ID, MONGODB_URI
npm run deploy   # register global slash commands (68 modules)
npm start        # shards + web server (PORT default 3000)
```

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `TOKEN` | Yes | Discord bot token |
| `MONGODB_URI` | Yes* | MongoDB connection string |
| `DISCORD_CLIENT_ID` | Yes* | Application ID (deploy + `/invite`) |
| `CLIENT_ID` | No | Alias for `DISCORD_CLIENT_ID` |
| `GUILD_ID` | No | Dev-only guild command registration |
| `PORT` | No | HTTP port (default `3000`) |

\*The process starts without MongoDB, but economy, guild config, **blacklist persistence**, and related features will not work until `MONGODB_URI` is set.

## Scripts

| Script | Command |
|--------|---------|
| Start bot + web | `npm start` |
| Dev (nodemon) | `npm run dev` |
| Deploy slash commands | `npm run deploy` |

## Commands (summary)

**68** slash command files are registered (including **8** owner-only: `shutdown`, `eval`, `set-credits`, `set-level`, `announce`, `blacklist`, `server-list`, `reload`). **60** are public-facing commands in `/help` (excluding glossary-style help entries).

| Area | Examples |
|------|----------|
| Utility | `ping`, `invite`, **`uptime`**, `help`, `info`, `profile`, `poll`, … |
| Economy | `balance`, `daily`, `work`, `rob`, `leaderboard`, `shop`, `quests`, … |
| Casino | `blackjack`, `slots`, `coinflip` |
| Leveling | `rank` |
| Moderation | `ban`, `purge`, `ticket-setup`, `automod-setup`, `log-setup`, `starboard-setup`, … |
| Fun / media | `8ball`, `trivia`, `meme`, `cat`, `urban`, … |
| Advanced | `cyber-heist`, `giveaway`, `network-stats`, `shards` |

Use **`/help`** in Discord or open **`commands.html`** on the site for the full matrix.

## Web & API

Static files are served from the project root with **path guards** (no `src/`, `node_modules/`, `.env`, etc. — see [SECURITY.md](SECURITY.md)).

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Liveness + version |
| `GET /api/version` | Package metadata |
| `GET /api/stats` | Guilds, members, ping (shard broadcast) |

## Repository layout

```
├── src/
│   ├── index.js              # ShardingManager + shardError + web bootstrap
│   ├── bot.js                # Per-shard client, MongoDB connect, commands/events
│   ├── commands/             # Slash commands (68 modules)
│   ├── events/
│   ├── models/               # User, GuildConfig, BlacklistEntry, …
│   ├── utils/                # Economy, cooldowns, blacklistService, logger, …
│   └── web/server.js
├── *.html, style.css, script.js
├── deploy-commands.js
├── LICENSE
└── SECURITY.md
```

## Authors

**watispro5212** · **watispro1**

## License

[Nexus Protocol License (BSL-Attribution)](LICENSE) — attribution required; commercial redistribution needs permission.

## Security

[Vulnerability reporting and version support → SECURITY.md](SECURITY.md)
