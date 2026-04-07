# Security Policy — Nexus Protocol

## Supported versions

| Version | Status | Support |
|---------|--------|---------|
| **7.x** | Current | Full security patches |
| 6.x | Legacy | Critical fixes only |
| 5.x | Previous | End of life |
| &lt; 5.0 | End of life | No support |

## Scope

This policy covers:

- The **Discord bot** (`src/`, sharding, commands, events)  
- **MongoDB-backed** features: economy, guild config, **global blacklist** (`BlacklistEntry`)  
- The **Express** static host + JSON API (`src/web/server.js`)  
- **Operational** issues: leaked tokens, insecure host configuration, accidental exposure of `.env`

It does **not** cover Discord’s platform security or your cloud provider’s SLA.

## Security measures (summary)

### Bot

- **Owner-only** gate for destructive commands (`eval`, `shutdown`, credit/level overrides, `broadcast`, `reload`, etc.)
- **Safe Math Engine:** Native recursive-descent parser for `/math` — **no `eval()` usage**.
- **Global blacklist** enforced before slash execution; **persisted in MongoDB**; in-memory Set hydrated on **ready**.
- **Guild-only** commands (no DMs)
- **Per-category cooldowns** (utility, economy, fun, moderation)
- **Guild module toggles** (economy, casino, fun, leveling) with correct command mapping
- **Compound Indexing:** User data isolated by `{ userId, guildId }` to prevent cross-guild data leakage.
- Automod, audit logging, starboard, tickets — permission-aware where applicable

### Data

- **Secrets** belong in `.env` only; never commit tokens or MongoDB URIs with embedded passwords to public repos.  
- **MongoDB**: use TLS (Atlas default), least-privilege DB user, IP allowlist when possible.  
- **Blacklist** documents contain `userId` and optional `reason`; treat exports as sensitive.  

### Web / API

- Static hosting uses **`dotfiles: 'deny'`** and middleware blocking `src/`, `node_modules/`, `scripts/`, dot-paths, `.env`, and `package-lock.json`.  
- **`GET /api/health`** — cheap liveness (no shard fan-out).  
- **`GET /api/version`** — package metadata.  
- **`GET /api/stats`** — aggregated stats via `broadcastEval` (same data as the companion site when co-hosted).  

**Production:** Put **HTTPS** in front (nginx, Caddy, Cloudflare) and restrict outbound access from the bot host as needed.

## Reporting a vulnerability

> Do **not** file a public issue for undisclosed exploits.

1. Email **williamdelilah3@gmail.com** or **altericjohnson2@gmail.com** with:
   - Description and impact  
   - Reproduction steps (if safe)  
   - Affected version / commit  
   - Severity (Critical / High / Medium / Low)

2. Target acknowledgement within **48 hours** where possible; a remediation timeline within **7 days** for confirmed issues.

3. Coordinated disclosure after a patch or mitigation is available.

## Contact

**Email:** williamdelilah3@gmail.com, altericjohnson2@gmail.com  

Thank you for helping keep Nexus Protocol operators and their communities safe.
