# NEXUS PROTOCOL // THE COMMUNITY BLUEPRINT
> Tier-1 Orchestration Directive — v10.0.0 "Omega"

This directive is the definitive architecture specification for the official Nexus Support Hub. It outlines a complete, enterprise-grade Discord server structure utilizing a "Prestige Nomenclature" system for maximum identity clarity, operational precision, and artisanal community aesthetics. Every sector, role, agent, and permission is documented to production quality.

---

## 🎭 SECTOR HIERARCHY — Full Role Registry
*Ranked by precedence (Highest → Lowest). Enable **Display Role Separately** for all roles down to and including `🧬 Operative`.*

| Identity | Emoji | Color | Mission Objective |
| :--- | :---: | :---: | :--- |
| **Founder** | `👑` | `#00F5FF` | Total sovereign dominion. Administrator access. 2FA required. |
| **Co-Founder** | `🌟` | `#7B2FFF` | Secondary authority. Full management scope minus role hierarchy edits. |
| **Admin** | `🛡️` | `#FF4444` | Executive management, community policy enforcement, and logistical oversight. |
| **Head Moderator** | `⚡` | `#FF6B35` | Leads the security team. Escalation point for all disputes and permanent bans. |
| **Developer** | `💻` | `#BB86FC` | Technical architects behind the core neural subsystems and integrations. |
| **Moderator** | `⚔️` | `#FFBD2E` | Front-line security monitoring and community directive enforcement. |
| **Support Lead** | `🎯` | `#00CFFF` | Manages the support operative team and ticket resolution pipeline. |
| **Support** | `🔧` | `#03DAC6` | Primary operatives for technical directive resolution and ticket triage. |
| **Community Manager** | `📣` | `#F9A825` | Events, announcements, giveaways, and all community engagement programs. |
| **Partner** | `🌐` | `#BD93F9` | Verified strategic allies and cross-server collaborators. |
| **Server Booster** | `💎` | `#F47FFF` | Elite entities providing node enhancements via Nitro Server Boosts. |
| **Event Winner** | `🏆` | `#FFD700` | Temporarily awarded to winners of server events and giveaways. |
| **Contributor** | `🛠️` | `#50FA7B` | Community members who contributed code, art, or documentation to the project. |
| **Early Operative** | `🥇` | `#FFB86C` | Founding members present during the initial Singularity deployment. Not earnable post-launch. |
| **Level 50+** | `🔥` | `#FF4D4D` | Top-tier operatives who reached Level 50 or higher via XP accumulation. |
| **Level 25+** | `⭐` | `#FFC107` | Mid-tier operatives who reached Level 25 via XP grinding. |
| **Level 10+** | `🌱` | `#69FF47` | Entry-level progression milestone — Level 10 unlocked via activity. |
| **Veteran** | `🎖️` | `#A0A0A0` | Users active for 6+ months with positive standing. Assigned manually by Admin. |
| **Operative** | `🧬` | `#F0F0F0` | Standard verified entities with full community hub access post-verification. |
| **New Entity** | `🌑` | `#606060` | Unverified newcomers awaiting Sentinel initialization. Severely restricted access. |
| **Neural Engine** | `🤖` | `#50FA7B` | Base integration role assigned to all external bot agents. |
| **Muted** | `🔇` | `#333333` | Temporarily silenced. Overrides all send permissions server-wide. |

---

## 🏛️ SECTOR ARCHITECTURE — Channel Mapping

> [!IMPORTANT]
> All channels within a category **MUST** be set to **Synced Permissions**. Never apply individual channel overrides unless explicitly noted.

---

### ╔══════════════════════════════════╗
### ║  📌 WELCOME & VERIFICATION       ║
### ╚══════════════════════════════════╝
*First sector visible to all new joins. Visible to `New Entity` and above.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `welcome` | `👋` | Auto-posted welcome embed with server overview and rules summary. Carl-bot managed. |
| `rules` | `📜` | The definitive behaviour directives. Numbered rules with explicit consequence tiers. |
| `verification` | `🔐` | CAPTCHA completion portal. Wick Bot managed. Hidden after role assignment. |
| `get-roles` | `🎭` | Self-role selection panel. Carl-bot button/dropdown panels for notifications and interests. |

---

### ╔══════════════════════════════════╗
### ║  📋 INFORMATIONAL                ║
### ╚══════════════════════════════════╝
*Read-only sector. Webhook and Admin managed. `Operative+` read access.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `overview` | `🧭` | Brand mission statement, project philosophy, and vision document. |
| `directory` | `🗂️` | Fully clickable index of all server sectors with jump links and descriptions. |
| `faq` | `❔` | Common questions and pre-solved inquiries. Updated monthly by Support Lead. |
| `links` | `🔗` | Official portal, GitHub, bot invite, changelog, and external social nodes. |
| `credits` | `🏅` | Acknowledgements for contributors, partners, and key community supporters. |
| `bot-info` | `🤖` | Overview of all bots in the server, their purpose, and their command zones. |

---

### ╔══════════════════════════════════╗
### ║  📡 NEWS & BROADCASTS            ║
### ╚══════════════════════════════════╝
*Announcement sector. Webhook-driven. Members subscribe via `get-roles`.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `announcements` | `📢` | Global shifts, major updates, and official framework declarations. |
| `changelog` | `🆙` | Real-time dev logs pushed via GitHub Actions + Zapier webhook. |
| `events` | `🎉` | Server event schedules, competitions, and community challenges. |
| `polls` | `📊` | Direct community voting on new features and framework direction. |
| `status` | `🟢` | Real-time API health, shard uptime, and outage reports via UptimeRobot webhook. |
| `partnerships` | `🤝` | New network ally announcements and cross-server collaboration notices. |
| `releases` | `📦` | GitHub release notes formatted by Zapier. Every version tag auto-posted here. |

---

### ╔══════════════════════════════════╗
### ║  💬 CENTRAL HUB                  ║
### ╚══════════════════════════════════╝
*Primary community interaction zone. Open to all `Operative+`.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `general` | `💬` | Primary high-fidelity discourse. All topics welcome within rules. |
| `introductions` | `🙌` | New operative self-introductions. Threaded format recommended. |
| `media` | `📸` | Screenshots, clips, artwork, and visual data exchange. |
| `memes` | `😂` | Community humour and off-topic content. Guidelines still apply. |
| `starboard` | `⭐` | Auto-pinned messages that earn 5+ ⭐ reactions. Carl-bot managed. |
| `confessions` | `🕵️` | Anonymous message submission via Carl-bot's anonymous form command. |
| `counting` | `🔢` | Classic counting game. One number per person, bot resets on mistake. |

---

### ╔══════════════════════════════════╗
### ║  🤖 BOT ZONE                     ║
### ╚══════════════════════════════════╝
*Dedicated bot interaction zone. Keep all bot commands confined here.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `bot-commands` | `⌨️` | Primary bot command zone for Nexus, Dank Memer, and general bot use. |
| `level-ups` | `📈` | Automated XP rank-up announcements and milestone pings. Nexus Bot output. |
| `rep-board` | `🌟` | Reputation leaderboard updates and milestone celebration pings. |
| `giveaways` | `🎁` | Active and archived giveaways hosted by Nexus Bot `/giveaway`. |
| `economy-logs` | `💰` | Automated economy transaction logs (heists, crimes, large transfers). |

---

### ╔══════════════════════════════════╗
### ║  🛠️ SUPPORT CENTER               ║
### ╚══════════════════════════════════╝
*The primary resolution matrix. Ticket system is the primary entry point.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `open-ticket` | `📥` | Click-to-create ticket panel. Nexus Bot `/ticket` command. Backup: Ticket Tool. |
| `knowledge-base` | `📚` | Repository of archived resolution guides written by the Support team. |
| `bug-reports` | `🐛` | Formal logic failure submissions. Format enforced via Nexus Bot modal. |
| `suggestions` | `💡` | Feature proposals and community innovation submissions with upvote reactions. |
| `bug-tracker` | `🗒️` | Running triaged log of known issues with status tags: `open`, `in-progress`, `fixed`. |
| `resolved-log` | `✅` | Sanitized closed ticket log for community transparency. No PII exposed. |
| `report-user` | `🚩` | Private thread channel for reporting user violations. Staff-reviewed within 24h. |

---

### ╔══════════════════════════════════╗
### ║  💻 DEVELOPMENT HUB              ║
### ╚══════════════════════════════════╝
*Restricted to `Developer+`. `Support Lead` and `Contributor` have read-only access.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `github-feed` | `🐙` | GitHub Actions webhook: all commits, PRs, and merge events. YAGPDB formatted. |
| `api-diagnostics` | `📡` | Raw Discord API endpoint responses and live shard health metrics. |
| `security-advisories` | `🛡️` | Internal CVE and zero-day vulnerability disclosures. Developer+ only. |
| `ui-design` | `🎨` | Portal aesthetics discussion, Figma mockups, and CSS iteration logs. |
| `tech-talk` | `⚙️` | Open architecture discussion for framework stack, dependencies, and patterns. |
| `staging-reports` | `🧪` | Pre-release build testing results, QA notes, and A/B test outcomes. |
| `dependency-log` | `📦` | npm/yarn package update changelog and `npm audit` scan reports. |
| `roadmap` | `🗺️` | Current sprint board, milestone tracker, and long-term feature roadmap. |

---

### ╔══════════════════════════════════╗
### ║  🌀 THE SINGULARITY              ║
### ╚══════════════════════════════════╝
*Community engagement & entertainment zone. Unlocked post-verification.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `lore-vault` | `🌌` | Deep-dives into Nexus Protocol backstory and world-building lore threads. |
| `art-gallery` | `🖼️` | Community artwork, fan-art, and custom design submissions. Reactions encouraged. |
| `games-lounge` | `🎲` | Bot-powered games: `/trivia`, `/tictactoe`, `/8ball`, coinflip. Nexus + Dank Memer. |
| `hot-takes` | `🔥` | Weekly debate topic. Pinned prompt, open discussion, no personal attacks. |
| `resources` | `📚` | Curated developer learning materials, tutorials, and reference documentation links. |
| `showcase` | `🚀` | Show off your projects, websites, or scripts. Self-promotion with rules. |
| `music-requests` | `🎵` | Song request queue for the audio lounge. Jockie Music command zone. |
| `partner-lounge` | `🤝` | Exclusive channel for verified Partners. Cross-server coordination and perks. |
| `booster-lounge` | `💎` | Exclusive channel for Server Boosters. Special perks and direct dev access. |

---

### ╔══════════════════════════════════╗
### ║  🔊 VOICE SECTOR                 ║
### ╚══════════════════════════════════╝
*Voice channels. All are text-enabled in Discord. Operative+ access by default.*

| Channel | Emoji | Type | Purpose |
|---|:---:|:---:|---|
| `general-voice` | `🎙️` | Voice | Primary audio uplink for all verified operatives. |
| `lofi-study` | `🎵` | Voice | Ambient / Lo-fi stream for focus sessions. Jockie Music active. |
| `gaming-vc` | `🎮` | Voice | Casual gaming voice. Screen-share enabled. |
| `staff-voice` | `🔒` | Voice | Staff-only voice channel. Moderator+ access required. |
| `events-stage` | `🔴` | Stage | Reserved for AMAs, community presentations, and live streams. |
| `afk-lounge` | `💤` | Voice | AFK channel. Auto-moved by Discord after idle timeout. |

---

### ╔══════════════════════════════════╗
### ║  🛡️ COMMAND CENTER (STAFF ONLY)  ║
### ╚══════════════════════════════════╝
*Hidden from all non-staff. Never expose these channels or their contents.*

| Channel | Emoji | Purpose |
|---|:---:|---|
| `security-feed` | `🚨` | Global audit logs of all infractions — Nexus Bot + Wick + MEE6 output. |
| `mod-log` | `🪵` | Automated log of every mod action: ban, kick, timeout, warn. Nexus + MEE6. |
| `mod-actions` | `⚔️` | Manual staff discussion channel for active cases and moderation decisions. |
| `analytics` | `📊` | Server growth, engagement analytics, and retention data. StatBot weekly reports. |
| `staff-general` | `💬` | Open coordination channel for all staff roles (Moderator and above). |
| `staff-guide` | `📋` | Pinned moderation handbook, escalation matrix, and protocol directives. |
| `dev-ops` | `💻` | Developer sprint coordination, deployment alerts, and CI/CD notifications. |
| `support-ops` | `🎯` | Support team ticket queue coordination, case handoffs, and escalation log. |
| `bot-config` | `⚙️` | Bot configuration commands run exclusively here. Never in public channels. |
| `founders-vault` | `👑` | Sovereign leadership channel. Founders and Co-Founders exclusively. |

---

---

## 📜 SERVER RULES DIRECTIVE (Quick Reference)

These are the core directives to be pasted into the `#📜-rules` channel:

1. **Maintain Professionalism (No Toxicity)**: Respect all operatives. Harassment, slurs, discrimination, and excessive toxicity will result in immediate sanction.
2. **No Unsolicited Advertising**: Do not post invite links, self-promote outside of `#showcase`, or DM advertise to members.
3. **Follow the Framework (Keep it on-topic)**: Ensure your discourse matches the channel topic. Bots belong in `#bot-commands`. Support goes in `#open-ticket`.
4. **No NSFW or Illegal Content**: Immediate permanent ban for any NSFW media, gore, or discussion of illegal activities.
5. **Respect Staff Directives**: If a Moderator instructs you to drop a topic or move channels, comply immediately. Disputes should be handled in private tickets, not public channels.
6. **No Spam or Malicious Links**: Spamming text, emojis, or malicious/phishing links will trigger an auto-ban via the Wick/Beemo Sentinel layer.

---

## 🔗 WEBHOOK ARCHITECTURE & AUTOMATIONS

> [!NOTE]
> Webhooks decouple bot dependencies and allow external services to post directly to Discord. Configure these in **Channel Settings > Integrations > Webhooks**.

### 1. GitHub Actions (Releases & Commits)
- **Target Channels**: `🆙-changelog` and `🐙-github-feed`
- **Use Case**: Automatically push new repository commits, pull requests, and version releases.
- **Service**: Native GitHub Webhooks + Zapier formatting.
- **Setup**: Create a webhook in the target channel, paste the URL into GitHub Repo Settings -> Webhooks. Set Content-Type to `application/json`.

### 2. Uptime Monitoring (BetterUptime)
- **Target Channel**: `🟢-status`
- **Use Case**: Post live alerts when the bot, website, or API shards go down.
- **Setup**: Link UptimeRobot or BetterUptime to a channel Webhook URL. It will automatically post offline/online state changes.

### 3. Zapier Social Feed
- **Target Channel**: `📢-announcements`
- **Use Case**: Automatically syndicate posts from Twitter/X or YouTube to Discord.
- **Setup**: Create a webhook named `Nexus Socials`, link the URL to Zapier. Format the message to include the video/tweet link.

### 4. Direct Support Feed
- **Target Channel**: `🎯-support-ops`
- **Use Case**: If using an external CRM or form (Tally/Typeform), route new high-priority tickets directly to staff via webhook.

---

## 🔐 MASTER PERMISSION MATRIX — Per-Role Full Breakdown

> [!IMPORTANT]
> The sections below define **General Server Permissions** AND **per-category access** for every role. Apply category permissions at the **Category level** with Sync enabled on all child channels.

---

### 👑 Founder & 🌟 Co-Founder

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Administrator | ✅ |
| Manage Server | ✅ |
| Manage Roles | ✅ |
| Manage Channels | ✅ |
| Manage Webhooks | ✅ |
| Kick / Ban Members | ✅ |
| Manage Nicknames | ✅ |
| Mention @everyone | ✅ |
| View Audit Log | ✅ |
| Manage Events | ✅ |
| All other permissions | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Manage Webhooks | Special |
|---|:---:|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | ✅ | ✅ | Can edit all bot embeds |
| 📋 Informational | ✅ | ✅ | ✅ | ✅ | — |
| 📡 News | ✅ | ✅ | ✅ | ✅ | Can @everyone ping |
| 💬 Central Hub | ✅ | ✅ | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | ✅ | — |
| 💻 Dev Hub | ✅ | ✅ | ✅ | ✅ | — |
| 🌀 Singularity | ✅ | ✅ | ✅ | ✅ | Access to all exclusive lounges |
| 🔊 Voice | ✅ | ✅ | ✅ | — | Mute/Deafen/Move all |
| 🛡️ Command Center | ✅ | ✅ | ✅ | ✅ | Full staff access |

---

### 🛡️ Admin

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Server | ✅ |
| Manage Roles *(below Admin)* | ✅ |
| Manage Channels | ✅ |
| Manage Webhooks | ✅ |
| Kick Members | ✅ |
| Ban Members | ✅ |
| Timeout Members | ✅ |
| Manage Nicknames | ✅ |
| Mention @everyone | ✅ |
| View Audit Log | ✅ |
| Manage Events | ✅ |
| Manage Messages | ✅ |
| Create / Manage Threads | ✅ |
| Use External Emojis | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Manage Webhooks | Special |
|---|:---:|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | ✅ | ✅ | Can reset verification |
| 📋 Informational | ✅ | ✅ | ✅ | ✅ | — |
| 📡 News | ✅ | ✅ | ✅ | ✅ | @everyone mention |
| 💬 Central Hub | ✅ | ✅ | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | ✅ | — |
| 💻 Dev Hub | ✅ | ✅ | ✅ | ✅ | — |
| 🌀 Singularity | ✅ | ✅ | ✅ | ✅ | Partner & Booster lounge access |
| 🔊 Voice | ✅ | ✅ | — | — | Mute/Deafen/Move all |
| 🛡️ Command Center | ✅ | ✅ | ✅ | ✅ | All staff channels |

---

### ⚡ Head Moderator

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Kick Members | ✅ |
| Ban Members | ✅ |
| Timeout Members | ✅ |
| Manage Messages | ✅ |
| Manage Nicknames | ✅ |
| View Audit Log | ✅ |
| Move Members (Voice) | ✅ |
| Deafen Members | ✅ |
| Mute Members | ✅ |
| Create Public / Private Threads | ✅ |
| Manage Threads | ✅ |
| Mention @here | ✅ |
| Use External Emojis | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Special |
|---|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | ✅ | — |
| 📋 Informational | ✅ | ❌ | ✅ | Read + manage only |
| 📡 News | ✅ | ❌ | ✅ | No broadcast rights |
| 💬 Central Hub | ✅ | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | Can close/manage tickets |
| 💻 Dev Hub | ✅ | ❌ | ❌ | Read-only |
| 🌀 Singularity | ✅ | ✅ | ✅ | — |
| 🔊 Voice | ✅ | ✅ | — | Full voice control |
| 🛡️ Command Center | ✅ | ✅ | ✅ | All staff channels except `founders-vault` |

---

### 💻 Developer

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Webhooks | ✅ |
| Use Application Commands | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Create Public Threads | ✅ |
| Use External Emojis | ✅ |
| Add Reactions | ✅ |
| Mention @here | ✅ *(Dev Hub only)* |

**Category Access:**
| Category | View | Send | Manage Messages | Manage Webhooks | Special |
|---|:---:|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | ❌ | — | Read-only |
| 📋 Informational | ✅ | ❌ | ❌ | — | Read-only |
| 📡 News | ✅ | ❌ | ❌ | — | Read-only |
| 💬 Central Hub | ✅ | ✅ | ❌ | — | — |
| 🤖 Bot Zone | ✅ | ✅ | ❌ | — | — |
| 🛠️ Support Center | ✅ | ✅ | ❌ | — | Can comment on bug reports |
| 💻 Dev Hub | ✅ | ✅ | ✅ | ✅ | Full write access |
| 🌀 Singularity | ✅ | ✅ | ❌ | — | — |
| 🔊 Voice | ✅ | ✅ | — | — | — |
| 🛡️ Command Center | ✅ | ✅ | ❌ | ❌ | Access: `dev-ops`, `bot-config`, `staff-general` only |

---

### ⚔️ Moderator

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Messages | ✅ |
| Manage Nicknames | ✅ |
| Timeout Members | ✅ |
| Kick Members | ✅ |
| Move Members (Voice) | ✅ |
| Mute Members | ✅ |
| Deafen Members | ✅ |
| View Audit Log | ✅ |
| Create Public Threads | ✅ |
| Manage Threads | ✅ |
| Use External Emojis | ✅ |
| Add Reactions | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Special |
|---|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | ✅ | — |
| 📋 Informational | ✅ | ❌ | ✅ | Manage messages only |
| 📡 News | ✅ | ❌ | ✅ | Manage messages only |
| 💬 Central Hub | ✅ | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | Can triage bugs and close resolved threads |
| 💻 Dev Hub | ❌ | ❌ | ❌ | No access |
| 🌀 Singularity | ✅ | ✅ | ✅ | — |
| 🔊 Voice | ✅ | ✅ | — | Mute/Move members |
| 🛡️ Command Center | ✅ | ✅ | ❌ | Access: `security-feed`, `mod-log`, `mod-actions`, `staff-general`, `staff-guide` |

---

### 🎯 Support Lead

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Messages *(Support Center only)* | ✅ |
| Create Private Threads | ✅ |
| Manage Threads | ✅ |
| Use Application Commands | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Special |
|---|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | ❌ | Read-only |
| 📋 Informational | ✅ | ❌ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | ❌ | Read-only |
| 💬 Central Hub | ✅ | ✅ | ❌ | — |
| 🤖 Bot Zone | ✅ | ✅ | ❌ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | Full ticket management; can assign/close/archive |
| 💻 Dev Hub | ✅ | ❌ | ❌ | Read-only (for bug context) |
| 🌀 Singularity | ✅ | ✅ | ❌ | — |
| 🔊 Voice | ✅ | ✅ | — | — |
| 🛡️ Command Center | ✅ | ✅ | ❌ | Access: `support-ops`, `staff-general`, `staff-guide` |

---

### 🔧 Support

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Messages *(Support Center only)* | ✅ |
| Create Private Threads | ✅ |
| Use Application Commands | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Special |
|---|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | ❌ | Read-only |
| 📋 Informational | ✅ | ❌ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | ❌ | Read-only |
| 💬 Central Hub | ✅ | ✅ | ❌ | — |
| 🤖 Bot Zone | ✅ | ✅ | ❌ | — |
| 🛠️ Support Center | ✅ | ✅ | ✅ | Can claim and resolve tickets; cannot delete |
| 💻 Dev Hub | ✅ | ❌ | ❌ | Read-only |
| 🌀 Singularity | ✅ | ✅ | ❌ | — |
| 🔊 Voice | ✅ | ✅ | — | — |
| 🛡️ Command Center | ✅ | ✅ | ❌ | Access: `support-ops`, `staff-general`, `staff-guide` only |

---

### 📣 Community Manager

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Manage Events | ✅ |
| Create Public Threads | ✅ |
| Mention @everyone *(Announcements only)* | ✅ |
| Manage Messages *(News + Events only)* | ✅ |
| Manage Webhooks *(News only)* | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |

**Category Access:**
| Category | View | Send | Manage Messages | Special |
|---|:---:|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | ✅ | Can post welcome announcements |
| 📋 Informational | ✅ | ✅ | ✅ | Can update FAQ and links |
| 📡 News | ✅ | ✅ | ✅ | Full broadcast rights. @everyone ping. |
| 💬 Central Hub | ✅ | ✅ | ✅ | Can pin messages and manage threads |
| 🤖 Bot Zone | ✅ | ✅ | ❌ | — |
| 🛠️ Support Center | ✅ | ❌ | ❌ | Read-only |
| 💻 Dev Hub | ✅ | ❌ | ❌ | Read-only |
| 🌀 Singularity | ✅ | ✅ | ✅ | Can post in all engagement channels |
| 🔊 Voice | ✅ | ✅ | — | Can manage Stage events |
| 🛡️ Command Center | ✅ | ✅ | ❌ | Access: `staff-general`, `analytics` only |

---

### 🌐 Partner

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |
| Use External Stickers | ✅ |
| Create Public Threads | ✅ |

**Category Access:**
| Category | View | Send | Special |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | Read-only |
| 📋 Informational | ✅ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | Read-only |
| 💬 Central Hub | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | Can submit bug reports and suggestions |
| 💻 Dev Hub | ❌ | ❌ | No access |
| 🌀 Singularity | ✅ | ✅ | Access to `partner-lounge` exclusively |
| 🔊 Voice | ✅ | ✅ | — |
| 🛡️ Command Center | ❌ | ❌ | No access |

---

### 💎 Server Booster

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Change Nickname | ✅ |
| Use External Emojis | ✅ |
| Use External Stickers | ✅ |
| Priority Speaker | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Stream *(higher quality)* | ✅ |

**Category Access:**
| Category | View | Send | Special |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | Read-only |
| 📋 Informational | ✅ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | Read-only |
| 💬 Central Hub | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | — |
| 💻 Dev Hub | ❌ | ❌ | No access |
| 🌀 Singularity | ✅ | ✅ | Exclusive `booster-lounge` access |
| 🔊 Voice | ✅ | ✅ | Priority Speaker enabled |
| 🛡️ Command Center | ❌ | ❌ | No access |

---

### 🛠️ Contributor

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |
| Create Public Threads | ✅ |

**Category Access:**
| Category | View | Send | Special |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | Read-only |
| 📋 Informational | ✅ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | Read-only |
| 💬 Central Hub | ✅ | ✅ | — |
| 🤖 Bot Zone | ✅ | ✅ | — |
| 🛠️ Support Center | ✅ | ✅ | Can comment on bugs in their area |
| 💻 Dev Hub | ✅ | ✅ *(tech-talk only)* | Read-only on all other dev channels |
| 🌀 Singularity | ✅ | ✅ | Can post in `showcase` |
| 🔊 Voice | ✅ | ✅ | — |
| 🛡️ Command Center | ❌ | ❌ | No access |

---

### 🥇 Early Operative / 🎖️ Veteran / 🏆 Event Winner / 🔥 Level 50+ / ⭐ Level 25+ / 🌱 Level 10+

*These are prestige/cosmetic roles. They inherit all `Operative` permissions plus the perks listed below.*

**General Server Permissions:** *(Same as `🧬 Operative` plus:)*
| Permission | Granted |
|---|:---:|
| Add Reactions | ✅ |
| Use External Emojis | ✅ |
| Use External Stickers | ✅ |
| Priority Speaker *(Level 50+ and Early Op only)* | ✅ |

**Category Access:** *(Identical to `🧬 Operative` in all categories. No additional category access.)*

> [!NOTE]
> `Level 50+` and `Early Operative` gain access to `booster-lounge` as a perk for their commitment to the server.

---

### 🧬 Verified Operative (Standard Member)

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| Send Messages | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Add Reactions | ✅ |
| Use Slash Commands | ✅ |
| Connect (Voice) | ✅ |
| Speak (Voice) | ✅ |
| Stream (Voice) | ✅ |
| Use Voice Activity | ✅ |
| Change Nickname | ✅ |

**Category Access:**
| Category | View | Send | Special |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ | ❌ | Read-only after verified |
| 📋 Informational | ✅ | ❌ | Read-only |
| 📡 News | ✅ | ❌ | Read-only. Can add reactions. |
| 💬 Central Hub | ✅ | ✅ | Full access |
| 🤖 Bot Zone | ✅ | ✅ | Full access |
| 🛠️ Support Center | ✅ | ✅ | Can submit tickets, bugs, suggestions |
| 💻 Dev Hub | ❌ | ❌ | No access |
| 🌀 Singularity | ✅ | ✅ | Full access (excl. exclusive lounges) |
| 🔊 Voice | ✅ | ✅ | Connect + Speak |
| 🛡️ Command Center | ❌ | ❌ | No access |

---

### 🌑 New Entity (Unverified)

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| View Channel *(#welcome, #rules, #verification only)* | ✅ |
| Send Messages *(#verification only)* | ✅ |
| All other permissions | ❌ |

**Category Access:**
| Category | View | Send | Notes |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ *(#welcome, #rules only)* | ✅ *(#verification only)* | CAPTCHA zone |
| All other categories | ❌ | ❌ | No access until verified |

---

### 🔇 Muted

**General Server Permissions:**
| Permission | Denied (Override) |
|---|:---:|
| Send Messages | ❌ |
| Send Messages in Threads | ❌ |
| Add Reactions | ❌ |
| Create Public Threads | ❌ |
| Create Private Threads | ❌ |
| Speak (Voice) | ❌ |

> [!WARNING]
> The Muted role must use **Deny** explicitly on the above permissions — not just remove them. This ensures the override applies regardless of what other roles the user holds. Apply the deny at the **Role level** in Server Settings → Roles, not per-channel.

**Category Access:** *(All categories: View ✅, Send ❌ — overriding all other roles)*

---

### 🤖 Neural Engine (All Bots)

**General Server Permissions:**
| Permission | Granted |
|---|:---:|
| View Channels | ✅ |
| Send Messages | ✅ |
| Embed Links | ✅ |
| Attach Files | ✅ |
| Read Message History | ✅ |
| Add Reactions | ✅ |
| Use External Emojis | ✅ |

**Category Access:** *(Bots receive access to specific channels based on their assigned bot-specific role, NOT via the base Neural Engine role.)*

| Category | View | Send | Notes |
|---|:---:|:---:|---|
| 📌 Welcome | ✅ | ✅ | Carl-bot welcome messages |
| 📋 Informational | ✅ | ❌ | Read-only by default |
| 📡 News | ✅ | ✅ | Webhook bots post here |
| 💬 Central Hub | ✅ | ✅ | General bot responses |
| 🤖 Bot Zone | ✅ | ✅ | Primary command zone |
| 🛠️ Support Center | ✅ | ✅ | Ticket bot, autoresponders |
| 💻 Dev Hub | ✅ | ✅ | GitHub webhook, YAGPDB |
| 🌀 Singularity | ✅ | ✅ | Game bots, music bot |
| 🔊 Voice | ✅ | — | Music bot voice join |
| 🛡️ Command Center | ✅ | ✅ | Audit log bots |

---

## 🏢 CATEGORY PERMISSION SUMMARY TABLE

*Quick reference for setting category-level overrides in Discord. Apply these at the category level with all channels synced.*

### 📌 WELCOME & VERIFICATION
| Role | View | Send | Manage Messages | Notes |
|---|:---:|:---:|:---:|---|
| `@everyone` | ✅ | ❌ | ❌ | Read-only globally |
| `🌑 New Entity` | ✅ | ✅ *(#verification)* | ❌ | CAPTCHA only |
| `🧬 Operative+` | ✅ | ❌ | ❌ | Read-only post-verify |
| `⚔️ Moderator+` | ✅ | ✅ | ✅ | — |
| `🤖 Neural Engine` | ✅ | ✅ | ❌ | Welcome bot output |

### 📋 INFORMATIONAL
| Role | View | Send | Manage Messages | Manage Webhooks |
|---|:---:|:---:|:---:|:---:|
| `@everyone` | ✅ | ❌ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ❌ | ❌ | ❌ |
| `📣 Comm. Manager+` | ✅ | ✅ | ✅ | ❌ |
| `🛡️ Admin+` | ✅ | ✅ | ✅ | ✅ |

### 📡 NEWS & BROADCASTS
| Role | View | Send | Manage Messages | @everyone Ping |
|---|:---:|:---:|:---:|:---:|
| `@everyone` | ✅ | ❌ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ❌ | ❌ | ❌ |
| `📣 Comm. Manager` | ✅ | ✅ | ✅ | ✅ |
| `🛡️ Admin+` | ✅ | ✅ | ✅ | ✅ |
| `🤖 Neural Engine` | ✅ | ✅ | ❌ | ❌ |

### 💬 CENTRAL HUB
| Role | View | Send | Manage Messages | Create Threads |
|---|:---:|:---:|:---:|:---:|
| `@everyone` | ✅ | ✅ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ✅ | ❌ | ✅ |
| `⚔️ Moderator+` | ✅ | ✅ | ✅ | ✅ |

### 🤖 BOT ZONE
| Role | View | Send | Manage Messages |
|---|:---:|:---:|:---:|
| `@everyone` | ✅ | ✅ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ✅ | ❌ |
| `⚔️ Moderator+` | ✅ | ✅ | ✅ |
| `🤖 Neural Engine` | ✅ | ✅ | ❌ |

### 🛠️ SUPPORT CENTER
| Role | View | Send | Manage Messages | Create Private Threads |
|---|:---:|:---:|:---:|:---:|
| `@everyone` | ✅ | ❌ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ✅ *(#open-ticket, #bug-reports, #suggestions only)* | ❌ | ❌ |
| `🔧 Support+` | ✅ | ✅ | ✅ | ✅ |

### 💻 DEVELOPMENT HUB
| Role | View | Send | Manage Webhooks |
|---|:---:|:---:|:---:|
| `@everyone` | ❌ | ❌ | ❌ |
| `🧬 Operative` | ❌ | ❌ | ❌ |
| `🛠️ Contributor` | ✅ *(#tech-talk only)* | ✅ *(#tech-talk only)* | ❌ |
| `🎯 Support Lead` | ✅ | ❌ | ❌ |
| `💻 Developer+` | ✅ | ✅ | ✅ |

### 🌀 THE SINGULARITY
| Role | View | Send | Create Threads |
|---|:---:|:---:|:---:|
| `@everyone` | ❌ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ✅ | ✅ |
| `🌐 Partner` | ✅ *(+partner-lounge)* | ✅ | ✅ |
| `💎 Booster` | ✅ *(+booster-lounge)* | ✅ | ✅ |

### 🔊 VOICE SECTOR
| Role | Connect | Speak | Stream | Priority Speaker | Move Members |
|---|:---:|:---:|:---:|:---:|:---:|
| `@everyone` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `🌑 New Entity` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `🧬 Operative+` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `💎 Booster` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `🥇 Early Op / 🔥 Lvl 50+` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `⚔️ Moderator+` | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🛡️ COMMAND CENTER (STAFF ONLY)
| Role | View | Send | Notes |
|---|:---:|:---:|---|
| `@everyone` | ❌ | ❌ | No access |
| `🧬 Operative` | ❌ | ❌ | No access |
| `🔧 Support` | ✅ | ✅ | `support-ops`, `staff-general`, `staff-guide` only |
| `🎯 Support Lead` | ✅ | ✅ | Same as Support |
| `📣 Comm. Manager` | ✅ | ✅ | `staff-general`, `analytics` only |
| `💻 Developer` | ✅ | ✅ | `dev-ops`, `bot-config`, `staff-general` only |
| `⚔️ Moderator` | ✅ | ✅ | `security-feed`, `mod-log`, `mod-actions`, `staff-general`, `staff-guide` |
| `⚡ Head Mod` | ✅ | ✅ | All channels except `founders-vault` |
| `🛡️ Admin+` | ✅ | ✅ | All channels |
| `👑 Founder / 🌟 Co-Founder` | ✅ | ✅ | All channels incl. `founders-vault` |

---

## ⚔️ VERIFICATION PROTOCOL — Dual-Layer Sentinel

### Layer 1 — Wick Bot (CAPTCHA Gate)

1. Create a `#🔐-verification` channel visible **only to `🌑 New Entity`**. All other roles have it hidden.
2. Enable Wick CAPTCHA Mode — force CAPTCHA completion in `#🔐-verification`.
3. On success: Wick removes `🌑 New Entity` and assigns `🧬 Operative` role automatically.
4. Account age minimum: **7 days**. Accounts under threshold receive an auto-kick with DM explanation.
5. Mass-join raid threshold: **20+ joins in 60 seconds** → auto-lockdown. Manual clear by Moderator+.

### Layer 2 — Beemo (Behavioural Anti-Bot)

1. Deploy Beemo in **Monitor Mode** for 7 days. Review flagged accounts daily.
2. After calibration, switch to **Auto-Ban Mode** for confirmed bot fingerprints.
3. All auto-bans are logged to `🚨-security-feed` with full metadata.

---

## 📋 SELF-ROLE PANELS (Carl-bot)

*Configure in `🎭-get-roles` using Carl-bot's Reaction Role or Button Role system.*

### Panel 1 — 🔔 Notification Preferences *(dropdown style)*
| Role Name | Emoji | Description |
|---|:---:|---|
| `@Announcements` | 📢 | Major update pings |
| `@Events` | 🎉 | Server event pings |
| `@Changelog` | 🆙 | Version log pings |
| `@Bug Pings` | 🐛 | New bug report pings |
| `@Feature Pings` | 💡 | Feature discussion pings |
| `@Giveaway Pings` | 🎁 | Giveaway entry pings |

### Panel 2 — 🏷️ Identity / Interests *(button style)*
| Role Name | Emoji | Description |
|---|:---:|---|
| `@Dev Interest` | 💻 | Interested in code contributions |
| `@Design Interest` | 🎨 | Interested in UI/art contributions |
| `@Beta Tester` | 🧪 | Willing to test pre-release builds |
| `@Open to Partner` | 🤝 | Open to cross-server collaboration |
| `@Gamer` | 🎮 | Into gaming sessions and events |

---

## 📜 MODERATION HANDBOOK — Quick Reference

### Infraction Escalation Matrix
| Severity | Example | Action | Max Duration | Authority |
|---|---|---|---|---|
| **Minor** | Spam, caps abuse, off-topic | Warning | — | Moderator+ |
| **Moderate** | Harassment, NSFW, slurs | Timeout | 24h | Moderator+ |
| **Severe** | Doxxing, threats, raiding | Timeout or Temp Ban | 7 days | Head Mod+ |
| **Critical** | CSAM, credible threats, mass raids | Permanent Ban | Permanent | Admin+ |
| **Repeat** | 3+ prior warnings | Temp Ban → Perm | 7–30 days → Perm | Head Mod+ |

### 4-Strike System
| Strike | Action | Who Reviews |
|---|---|---|
| 1st | Formal `/warn` issued via Nexus Bot. Logged to profile. | Moderator |
| 2nd | 24-hour timeout. Note added to `⚔️-mod-actions`. | Moderator |
| 3rd | 7-day temporary ban. Head Mod must approve reinstatement. | Head Mod |
| 4th | Permanent ban. Admin must approve and document. | Admin |

---

## 🔗 OFFICIAL NETWORK LINKS
| Resource | URL |
|---|---|
| **Bot Invite** | [discord.com/oauth2/authorize](https://discord.com/api/oauth2/authorize?client_id=1480725340753101031&permissions=8&scope=bot+applications.commands) |
| **Web Portal** | [shiny-giigles.pages.dev](https://shiny-giigles.pages.dev/) |
| **Commands** | [shiny-giigles.pages.dev/commands.html](https://shiny-giigles.pages.dev/commands.html) |
| **GitHub** | [github.com/watispro5212/shiny-giigles](https://github.com/watispro5212/shiny-giigles) |
| **Support Server** | [discord.gg/nexus](https://discord.gg/nexus) |
| **Changelog** | [shiny-giigles.pages.dev/changelog.html](https://shiny-giigles.pages.dev/changelog.html) |
| **Wiki** | [shiny-giigles.pages.dev/wiki.html](https://shiny-giigles.pages.dev/wiki.html) |

---

*NEXUS PROTOCOL © 2026 // ALL SYSTEMS OMEGA — v10.0.0*
