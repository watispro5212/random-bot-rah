const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const SUPPORT_GUILD_ID = '1492345037848186930';

// ═══════════════════════════════════════════════════════════
// ROLE REGISTRY — HIGHEST → LOWEST (Founder at top, Muted at bottom)
// ═══════════════════════════════════════════════════════════
const ROLES = [
    {
        name: '👑 Founder', color: '#00F5FF', hoist: true,
        permissions: ['Administrator']
    },
    {
        name: '🌟 Co-Founder', color: '#7B2FFF', hoist: true,
        permissions: ['Administrator']
    },
    {
        name: '🛡️ Admin', color: '#FF4444', hoist: true,
        permissions: ['ManageGuild', 'ManageRoles', 'ManageChannels', 'ManageWebhooks', 'KickMembers', 'BanMembers', 'ModerateMembers', 'ManageNicknames', 'MentionEveryone', 'ViewAuditLog', 'ManageEvents', 'ManageMessages', 'CreatePublicThreads', 'CreatePrivateThreads', 'ManageThreads', 'UseExternalEmojis']
    },
    {
        name: '⚡ Head Moderator', color: '#FF6B35', hoist: true,
        permissions: ['KickMembers', 'BanMembers', 'ModerateMembers', 'ManageMessages', 'ManageNicknames', 'ViewAuditLog', 'MoveMembers', 'DeafenMembers', 'MuteMembers', 'CreatePublicThreads', 'CreatePrivateThreads', 'ManageThreads', 'MentionEveryone', 'UseExternalEmojis']
    },
    {
        name: '💻 Developer', color: '#BB86FC', hoist: true,
        permissions: ['ManageWebhooks', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'CreatePublicThreads', 'UseExternalEmojis', 'AddReactions']
    },
    {
        name: '⚔️ Moderator', color: '#FFBD2E', hoist: true,
        permissions: ['ManageMessages', 'ManageNicknames', 'ModerateMembers', 'KickMembers', 'MoveMembers', 'MuteMembers', 'DeafenMembers', 'ViewAuditLog', 'CreatePublicThreads', 'ManageThreads', 'UseExternalEmojis', 'AddReactions']
    },
    {
        name: '🎯 Support Lead', color: '#00CFFF', hoist: true,
        permissions: ['ManageMessages', 'CreatePrivateThreads', 'ManageThreads', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🔧 Support', color: '#03DAC6', hoist: true,
        permissions: ['ManageMessages', 'CreatePrivateThreads', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '📣 Community Manager', color: '#F9A825', hoist: true,
        permissions: ['ManageEvents', 'CreatePublicThreads', 'MentionEveryone', 'ManageMessages', 'ManageWebhooks', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🌐 Partner', color: '#BD93F9', hoist: true,
        permissions: ['EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'CreatePublicThreads']
    },
    {
        name: '💎 Server Booster', color: '#F47FFF', hoist: true,
        permissions: ['ChangeNickname', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'Stream']
    },
    { name: '🏆 Event Winner', color: '#FFD700', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '🛠️ Contributor', color: '#50FA7B', hoist: false, permissions: ['EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis', 'CreatePublicThreads'] },
    { name: '🥇 Early Operative', color: '#FFB86C', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker'] },
    { name: '🔥 Level 50+', color: '#FF4D4D', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker'] },
    { name: '⭐ Level 25+', color: '#FFC107', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '🌱 Level 10+', color: '#69FF47', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '🎖️ Veteran', color: '#A0A0A0', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    {
        name: '🧬 Operative', color: '#F0F0F0', hoist: true,
        permissions: ['SendMessages', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseApplicationCommands', 'Connect', 'Speak', 'Stream', 'UseVAD', 'ChangeNickname', 'ViewChannel']
    },
    {
        name: '🌑 New Entity', color: '#606060', hoist: false,
        permissions: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
    },
    {
        name: '🤖 Neural Engine', color: '#50FA7B', hoist: false,
        permissions: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles', 'ReadMessageHistory', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🔇 Muted', color: '#333333', hoist: false,
        permissions: []
    },
];

// Self-role / ping roles (no perms, created below main roles)
const PING_ROLES = [
    { name: 'Announcements', color: '#5865F2' },
    { name: 'Events', color: '#5865F2' },
    { name: 'Changelog', color: '#5865F2' },
    { name: 'Bug Pings', color: '#5865F2' },
    { name: 'Feature Pings', color: '#5865F2' },
    { name: 'Giveaway Pings', color: '#5865F2' },
    { name: 'Dev Interest', color: '#5865F2' },
    { name: 'Design Interest', color: '#5865F2' },
    { name: 'Beta Tester', color: '#5865F2' },
    { name: 'Open to Partner', color: '#5865F2' },
    { name: 'Gamer', color: '#5865F2' },
];

// ═══════════════════════════════════════════════════════════
// CATEGORY PERMISSION OVERRIDES (from server.md)
// ═══════════════════════════════════════════════════════════
function buildCategoryOverrides(roleMap, everyoneId) {
    const P = PermissionsBitField.Flags;
    const r = roleMap; // shorthand

    return {
        '📌 WELCOME & VERIFICATION': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['🌑 New Entity'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: r['⚡ Head Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: r['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks] },
        ],
        '📋 INFORMATIONAL': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: r['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
        ],
        '📡 NEWS & BROADCASTS': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel, P.AddReactions, P.ReadMessageHistory] },
            { id: r['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.MentionEveryone] },
            { id: r['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.MentionEveryone] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks] },
        ],
        '💬 CENTRAL HUB': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.CreatePublicThreads] },
            { id: r['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePublicThreads] },
            { id: r['⚡ Head Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePublicThreads] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks, P.AddReactions] },
        ],
        '🤖 BOT ZONE': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks, P.AddReactions] },
        ],
        '🛠️ SUPPORT CENTER': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['🔧 Support'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePrivateThreads] },
            { id: r['🎯 Support Lead'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePrivateThreads, P.ManageThreads] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks] },
        ],
        '💻 DEVELOPMENT HUB': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🛠️ Contributor'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['🎯 Support Lead'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['💻 Developer'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks, P.ReadMessageHistory] },
            { id: r['⚡ Head Moderator'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: r['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks, P.ReadMessageHistory] },
            { id: r['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks] },
        ],
        '🌀 THE SINGULARITY': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: r['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.CreatePublicThreads] },
            { id: r['🌐 Partner'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads, P.ReadMessageHistory] },
            { id: r['💎 Server Booster'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads, P.ReadMessageHistory] },
        ],
        '🔊 VOICE SECTOR': [
            { id: everyoneId, deny: [P.Connect, P.ViewChannel] },
            { id: r['🌑 New Entity'], deny: [P.ViewChannel, P.Connect] },
            { id: r['🧬 Operative'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.UseVAD] },
            { id: r['💎 Server Booster'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.PrioritySpeaker] },
            { id: r['🔥 Level 50+'], allow: [P.ViewChannel, P.Connect, P.Speak, P.PrioritySpeaker] },
            { id: r['🥇 Early Operative'], allow: [P.ViewChannel, P.Connect, P.Speak, P.PrioritySpeaker] },
            { id: r['⚔️ Moderator'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.MuteMembers, P.MoveMembers, P.PrioritySpeaker] },
        ],
        '🛡️ COMMAND CENTER': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: r['🔧 Support'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['🎯 Support Lead'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['💻 Developer'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: r['⚡ Head Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ReadMessageHistory] },
            { id: r['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks, P.ReadMessageHistory] },
        ],
    };
}

// ═══════════════════════════════════════════════════════════
// CHANNEL ARCHITECTURE (from server.md)
// ═══════════════════════════════════════════════════════════
const CATEGORIES = [
    {
        name: '📌 WELCOME & VERIFICATION',
        channels: [
            { name: '👋-welcome', type: ChannelType.GuildText, topic: 'Auto-posted welcome embed with server overview and rules summary.' },
            { name: '📜-rules', type: ChannelType.GuildText, topic: 'The definitive behaviour directives. Read before participating.' },
            { name: '🔐-verification', type: ChannelType.GuildText, topic: 'CAPTCHA completion portal. Complete to gain access.' },
            { name: '🎭-get-roles', type: ChannelType.GuildText, topic: 'Self-role selection panel for notifications and interests.' },
        ]
    },
    {
        name: '📋 INFORMATIONAL',
        channels: [
            { name: '🧭-overview', type: ChannelType.GuildText, topic: 'Brand mission statement and project philosophy.' },
            { name: '🗂️-directory', type: ChannelType.GuildText, topic: 'Clickable index of all server sectors with jump links.' },
            { name: '❔-faq', type: ChannelType.GuildText, topic: 'Common questions and pre-solved inquiries.' },
            { name: '🔗-links', type: ChannelType.GuildText, topic: 'Official portal, GitHub, bot invite, and social links.' },
            { name: '🏅-credits', type: ChannelType.GuildText, topic: 'Acknowledgements for contributors and supporters.' },
            { name: '🤖-bot-info', type: ChannelType.GuildText, topic: 'Overview of all bots in the server.' },
        ]
    },
    {
        name: '📡 NEWS & BROADCASTS',
        channels: [
            { name: '📢-announcements', type: ChannelType.GuildText, topic: 'Global updates and official framework declarations.' },
            { name: '🆙-changelog', type: ChannelType.GuildText, topic: 'Real-time dev logs and version updates.' },
            { name: '🎉-events', type: ChannelType.GuildText, topic: 'Server event schedules and community challenges.' },
            { name: '📊-polls', type: ChannelType.GuildText, topic: 'Community voting on new features and direction.' },
            { name: '🟢-status', type: ChannelType.GuildText, topic: 'Real-time API health and shard uptime reports.' },
            { name: '🤝-partnerships', type: ChannelType.GuildText, topic: 'Network ally announcements and collaborations.' },
            { name: '📦-releases', type: ChannelType.GuildText, topic: 'GitHub release notes for every version tag.' },
        ]
    },
    {
        name: '💬 CENTRAL HUB',
        channels: [
            { name: '💬-general', type: ChannelType.GuildText, topic: 'Primary high-fidelity discourse. All topics welcome.' },
            { name: '🙌-introductions', type: ChannelType.GuildText, topic: 'New operative self-introductions.' },
            { name: '📸-media', type: ChannelType.GuildText, topic: 'Screenshots, clips, artwork, and visual data.' },
            { name: '😂-memes', type: ChannelType.GuildText, topic: 'Community humour. Guidelines still apply.' },
            { name: '⭐-starboard', type: ChannelType.GuildText, topic: 'Auto-pinned messages with 5+ ⭐ reactions.' },
            { name: '🕵️-confessions', type: ChannelType.GuildText, topic: 'Anonymous message submission.' },
            { name: '🔢-counting', type: ChannelType.GuildText, topic: 'Classic counting game. One number per person.' },
        ]
    },
    {
        name: '🤖 BOT ZONE',
        channels: [
            { name: '⌨️-bot-commands', type: ChannelType.GuildText, topic: 'Primary bot command zone.' },
            { name: '📈-level-ups', type: ChannelType.GuildText, topic: 'Automated XP rank-up announcements.' },
            { name: '🌟-rep-board', type: ChannelType.GuildText, topic: 'Reputation leaderboard updates.' },
            { name: '🎁-giveaways', type: ChannelType.GuildText, topic: 'Active and archived giveaways.' },
            { name: '💰-economy-logs', type: ChannelType.GuildText, topic: 'Automated economy transaction logs.' },
        ]
    },
    {
        name: '🛠️ SUPPORT CENTER',
        channels: [
            { name: '📥-open-ticket', type: ChannelType.GuildText, topic: 'Click-to-create ticket panel.' },
            { name: '📚-knowledge-base', type: ChannelType.GuildText, topic: 'Archived resolution guides.' },
            { name: '🐛-bug-reports', type: ChannelType.GuildText, topic: 'Formal logic failure submissions.' },
            { name: '💡-suggestions', type: ChannelType.GuildText, topic: 'Feature proposals with upvote reactions.' },
            { name: '🗒️-bug-tracker', type: ChannelType.GuildText, topic: 'Triaged log of known issues.' },
            { name: '✅-resolved-log', type: ChannelType.GuildText, topic: 'Sanitized closed ticket log.' },
            { name: '🚩-report-user', type: ChannelType.GuildText, topic: 'Private user violation reports.' },
        ]
    },
    {
        name: '💻 DEVELOPMENT HUB',
        channels: [
            { name: '🐙-github-feed', type: ChannelType.GuildText, topic: 'GitHub commits, PRs, and merge events.' },
            { name: '📡-api-diagnostics', type: ChannelType.GuildText, topic: 'Discord API responses and shard health.' },
            { name: '🛡️-security-advisories', type: ChannelType.GuildText, topic: 'Internal CVE and vulnerability disclosures.' },
            { name: '🎨-ui-design', type: ChannelType.GuildText, topic: 'Portal aesthetics and CSS iteration.' },
            { name: '⚙️-tech-talk', type: ChannelType.GuildText, topic: 'Architecture discussion and patterns.' },
            { name: '🧪-staging-reports', type: ChannelType.GuildText, topic: 'Pre-release QA notes and testing.' },
            { name: '📦-dependency-log', type: ChannelType.GuildText, topic: 'npm package updates and audit reports.' },
            { name: '🗺️-roadmap', type: ChannelType.GuildText, topic: 'Sprint board and feature roadmap.' },
        ]
    },
    {
        name: '🌀 THE SINGULARITY',
        channels: [
            { name: '🌌-lore-vault', type: ChannelType.GuildText, topic: 'Nexus Protocol backstory and lore.' },
            { name: '🖼️-art-gallery', type: ChannelType.GuildText, topic: 'Community artwork and submissions.' },
            { name: '🎲-games-lounge', type: ChannelType.GuildText, topic: 'Bot-powered games zone.' },
            { name: '🔥-hot-takes', type: ChannelType.GuildText, topic: 'Weekly debate topic.' },
            { name: '📚-resources', type: ChannelType.GuildText, topic: 'Developer learning materials.' },
            { name: '🚀-showcase', type: ChannelType.GuildText, topic: 'Show off your projects.' },
            { name: '🎵-music-requests', type: ChannelType.GuildText, topic: 'Song request queue.' },
            { name: '🤝-partner-lounge', type: ChannelType.GuildText, topic: 'Exclusive partner channel.' },
            { name: '💎-booster-lounge', type: ChannelType.GuildText, topic: 'Exclusive booster channel.' },
        ]
    },
    {
        name: '🔊 VOICE SECTOR',
        channels: [
            { name: '🎙️-general-voice', type: ChannelType.GuildVoice },
            { name: '🎵-lofi-study', type: ChannelType.GuildVoice },
            { name: '🎮-gaming-vc', type: ChannelType.GuildVoice },
            { name: '🔒-staff-voice', type: ChannelType.GuildVoice },
            { name: '🔴-events-stage', type: ChannelType.GuildStageVoice },
            { name: '💤-afk-lounge', type: ChannelType.GuildVoice },
        ]
    },
    {
        name: '🛡️ COMMAND CENTER',
        channels: [
            { name: '🚨-security-feed', type: ChannelType.GuildText, topic: 'Global audit logs of all infractions.' },
            { name: '🪵-mod-log', type: ChannelType.GuildText, topic: 'Automated log of every mod action.' },
            { name: '⚔️-mod-actions', type: ChannelType.GuildText, topic: 'Manual staff discussion for active cases.' },
            { name: '📊-analytics', type: ChannelType.GuildText, topic: 'Server growth and engagement analytics.' },
            { name: '💬-staff-general', type: ChannelType.GuildText, topic: 'Open coordination for all staff.' },
            { name: '📋-staff-guide', type: ChannelType.GuildText, topic: 'Moderation handbook and protocols.' },
            { name: '💻-dev-ops', type: ChannelType.GuildText, topic: 'Developer sprint coordination.' },
            { name: '🎯-support-ops', type: ChannelType.GuildText, topic: 'Support team ticket coordination.' },
            { name: '⚙️-bot-config', type: ChannelType.GuildText, topic: 'Bot configuration commands only.' },
            { name: '👑-founders-vault', type: ChannelType.GuildText, topic: 'Sovereign leadership channel. Founders only.' },
        ]
    },
];

// ═══════════════════════════════════════════════════════════
// RULES CONTENT (posted into #📜-rules)
// ═══════════════════════════════════════════════════════════
const RULES_EMBEDS = [
    {
        title: '📜  NEXUS PROTOCOL — SERVER DIRECTIVES',
        description: 'Welcome to the Nexus Protocol Support Hub. The following rules are absolute. Violation results in escalating sanctions up to and including permanent removal.\n\n*Last updated: v11.0.0 — Apex*',
        color: 0xD4A040,
    },
    {
        title: '1️⃣  Maintain Professionalism',
        description: '• Respect all operatives at all times.\n• Harassment, slurs, hate speech, discrimination, doxxing, and excessive toxicity result in **immediate sanction**.\n• This applies to text, voice, DMs to members, and profile content.',
        color: 0x00F5FF,
    },
    {
        title: '2️⃣  No Unsolicited Advertising',
        description: '• Do not post invite links, self-promote, or advertise outside of `#🚀-showcase`.\n• Do not DM members with advertisements or promotions.\n• Server partnerships go through official channels only.',
        color: 0x00F5FF,
    },
    {
        title: '3️⃣  Follow the Framework (Stay On-Topic)',
        description: '• Keep discussions relevant to the channel topic.\n• Bot commands belong in `#⌨️-bot-commands`.\n• Support requests belong in `#📥-open-ticket`.\n• Memes belong in `#😂-memes`.',
        color: 0x00F5FF,
    },
    {
        title: '4️⃣  No NSFW or Illegal Content',
        description: '• **Immediate permanent ban** for any NSFW media, gore, shock content, or discussion of illegal activities.\n• No exceptions. No warnings. No appeals.',
        color: 0xFF4444,
    },
    {
        title: '5️⃣  Respect Staff Directives',
        description: '• If a Moderator instructs you to drop a topic or move channels, comply immediately.\n• Disputes must be handled in **private tickets**, not public channels.\n• Staff-baiting, loopholing, or arguing in public results in a timeout.',
        color: 0x00F5FF,
    },
    {
        title: '6️⃣  No Spam or Malicious Links',
        description: '• Spamming text, emoji, reactions, pings, or images triggers an auto-ban.\n• Malicious, phishing, or IP-grabbing links result in an **immediate permanent ban**.\n• The Sentinel layer (Wick + Beemo) monitors this 24/7.',
        color: 0xFF4444,
    },
    {
        title: '⚖️  Infraction Escalation',
        description: '```\n Strike 1 → Formal /warn (logged to profile)\n Strike 2 → 24-hour timeout\n Strike 3 → 7-day temp ban (Head Mod approval)\n Strike 4 → Permanent ban (Admin approval)\n```\n\n*Critical violations (CSAM, threats, raids) bypass the strike system and result in an immediate permanent ban.*',
        color: 0xFFBD2E,
    },
];

// ═══════════════════════════════════════════════════════════
// GET-ROLES SETUP CONTENT (posted into #🎭-get-roles)
// ═══════════════════════════════════════════════════════════
const GET_ROLES_EMBEDS = [
    {
        title: '🔔  NOTIFICATION PREFERENCES',
        description: 'Select the notifications you want to receive. Use **Carl-bot reaction roles** (dropdown) to assign these:\n\n' +
            '📢 `@Announcements` — Major update pings\n' +
            '🎉 `@Events` — Server event pings\n' +
            '🆙 `@Changelog` — Version log pings\n' +
            '🐛 `@Bug Pings` — New bug report pings\n' +
            '💡 `@Feature Pings` — Feature discussion pings\n' +
            '🎁 `@Giveaway Pings` — Giveaway entry pings\n\n' +
            '> **Setup:** Use Carl-bot dashboard → Reaction Roles → Create a **Dropdown** panel in this channel with the roles above.',
        color: 0xD4A040,
    },
    {
        title: '🏷️  IDENTITY & INTERESTS',
        description: 'Let us know what you\'re into. Use **Carl-bot reaction roles** (buttons) to assign these:\n\n' +
            '💻 `@Dev Interest` — Interested in code contributions\n' +
            '🎨 `@Design Interest` — Interested in UI/art contributions\n' +
            '🧪 `@Beta Tester` — Willing to test pre-release builds\n' +
            '🤝 `@Open to Partner` — Open to cross-server collaboration\n' +
            '🎮 `@Gamer` — Into gaming sessions and events\n\n' +
            '> **Setup:** Use Carl-bot dashboard → Reaction Roles → Create a **Button** panel in this channel with the roles above.',
        color: 0x7B2FFF,
    },
];

// ═══════════════════════════════════════════════════════════
// OVERVIEW CONTENT (posted into #🧭-overview)
// ═══════════════════════════════════════════════════════════
const OVERVIEW_EMBED = {
    title: '⚡ NEXUS PROTOCOL — THE SUPPORT HUB',
    description: [
        '> *Tier-1 Community Infrastructure — v11.0.0 "Apex"*\n',
        'Welcome to the official **Nexus Protocol** support server. This is the primary hub for:',
        '',
        '🛡️ **Bot Support** — Get help with Nexus commands, configuration, and troubleshooting',
        '🐛 **Bug Reports** — Report issues and track their resolution',
        '💡 **Suggestions** — Propose new features and vote on community ideas',
        '📢 **Announcements** — Stay updated with the latest releases and changes',
        '🎮 **Community** — Chat, play games, share media, and hang out',
        '💻 **Development** — Follow the development process and contribute',
        '',
        '**Quick Links:**',
        '🔗 [Web Portal](https://shiny-giigles.pages.dev/)',
        '📦 [GitHub](https://github.com/watispro5212/shiny-giigles)',
        '🤖 [Invite Nexus](https://discord.com/api/oauth2/authorize?client_id=1480725340753101031&permissions=8&scope=bot+applications.commands)',
        '📖 [Commands](https://shiny-giigles.pages.dev/commands.html)',
        '',
        '*Start by reading the rules in <#📜-rules> and picking your roles in <#🎭-get-roles>.*',
    ].join('\n'),
    color: 0xD4A040,
};

// ═══════════════════════════════════════════════════════════
// LINKS CONTENT (posted into #🔗-links)
// ═══════════════════════════════════════════════════════════
const LINKS_EMBED = {
    title: '🔗  OFFICIAL NETWORK LINKS',
    description: [
        '| Resource | Link |',
        '|---|---|',
        '| 🤖 **Bot Invite** | [Add Nexus to your server](https://discord.com/api/oauth2/authorize?client_id=1480725340753101031&permissions=8&scope=bot+applications.commands) |',
        '| 🌐 **Web Portal** | [shiny-giigles.pages.dev](https://shiny-giigles.pages.dev/) |',
        '| 📖 **Commands** | [Command Index](https://shiny-giigles.pages.dev/commands.html) |',
        '| 📦 **GitHub** | [watispro5212/shiny-giigles](https://github.com/watispro5212/shiny-giigles) |',
        '| 💬 **Support** | [discord.com/invite/DYXBEd2G8M](https://discord.com/invite/DYXBEd2G8M) |',
        '| 📜 **Changelog** | [Changelog](https://shiny-giigles.pages.dev/changelog.html) |',
        '| 📚 **Wiki** | [Wiki](https://shiny-giigles.pages.dev/wiki.html) |',
    ].join('\n'),
    color: 0x00F5FF,
};

// ═══════════════════════════════════════════════════════════════════
// UTILITY: Delete all non-system channels and non-managed roles
// ═══════════════════════════════════════════════════════════════════
async function nukeServer(guild, log) {
    // Delete all channels except the interaction channel
    log.push('🗑️ Deleting all existing channels...');
    const channels = guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory);
    for (const [, ch] of channels) {
        try { await ch.delete('Nexus Blueprint: Full reset'); } catch {}
    }
    const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
    for (const [, cat] of categories) {
        try { await cat.delete('Nexus Blueprint: Full reset'); } catch {}
    }
    log.push(`  ✅ Deleted ${channels.size} channels + ${categories.size} categories`);

    // Delete all non-managed, non-@everyone roles
    log.push('🗑️ Deleting all existing custom roles...');
    let deletedRoles = 0;
    const roles = guild.roles.cache
        .filter(r => r.id !== guild.id && !r.managed && r.name !== '@everyone')
        .sort((a, b) => a.position - b.position);
    for (const [, role] of roles) {
        try { await role.delete('Nexus Blueprint: Full reset'); deletedRoles++; } catch {}
    }
    log.push(`  ✅ Deleted ${deletedRoles} roles`);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-server')
        .setDescription('Deploy the full Nexus Blueprint to the support server. FOUNDER ONLY.')
        .setDefaultMemberPermissions(0),
    ownerOnly: true,
    cooldown: 0,
    async execute(interaction, client) {
        if (interaction.guild.id !== SUPPORT_GUILD_ID) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Wrong Server',
                    description: `This command can only be run in the official Nexus Support Hub (\`${SUPPORT_GUILD_ID}\`).`,
                    color: '#ED4245'
                })],
                ephemeral: true
            });
        }

        // Respond immediately — the original channel may be deleted
        await interaction.reply({
            embeds: [embedBuilder({
                title: '⚡ NEXUS BLUEPRINT — DEPLOYING',
                description: '**Full server wipe + rebuild in progress...**\nThis will take 1-3 minutes. A report will be posted when complete.',
                color: '#D4A040'
            })],
            ephemeral: true
        });

        const guild = interaction.guild;
        const log = [];

        try {
            // ═══════════════════════════════════════════
            // PHASE 0: FULL WIPE
            // ═══════════════════════════════════════════
            log.push('**═══ PHASE 0: FULL SERVER WIPE ═══**');
            await nukeServer(guild, log);

            // Small delay for API rate limits
            await new Promise(r => setTimeout(r, 2000));

            // ═══════════════════════════════════════════
            // PHASE 1: CREATE ROLES (highest → lowest)
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 1: ROLE DEPLOYMENT (Highest → Lowest) ═══**');
            const roleMap = {};
            const createdRoles = [];

            for (const roleDef of ROLES) {
                try {
                    const permBits = new PermissionsBitField(
                        (roleDef.permissions || []).map(p => PermissionsBitField.Flags[p]).filter(Boolean)
                    );
                    const role = await guild.roles.create({
                        name: roleDef.name,
                        color: roleDef.color,
                        hoist: roleDef.hoist,
                        permissions: permBits,
                        reason: 'Nexus Blueprint: Auto-generated role',
                    });
                    roleMap[roleDef.name] = role.id;
                    createdRoles.push(role);
                    log.push(`✅ Created: \`${roleDef.name}\``);
                } catch (err) {
                    log.push(`❌ Failed: \`${roleDef.name}\` — ${err.message}`);
                }
            }

            // Reorder roles: first in ROLES array = highest position
            log.push('\n↻ Reordering roles to match hierarchy...');
            try {
                const botRole = guild.members.me.roles.highest;
                const maxPos = botRole.position - 1;
                const positionUpdates = [];

                for (let i = 0; i < createdRoles.length; i++) {
                    const targetPos = Math.max(1, maxPos - i);
                    positionUpdates.push({ role: createdRoles[i].id, position: targetPos });
                }

                await guild.roles.setPositions(positionUpdates);
                log.push('✅ Roles reordered (Founder → Muted)');
            } catch (err) {
                log.push(`⚠️ Role reorder: ${err.message}`);
            }

            // Ping roles (below main roles)
            log.push('\n**═══ PHASE 1B: PING ROLES ═══**');
            for (const pr of PING_ROLES) {
                try {
                    await guild.roles.create({
                        name: pr.name,
                        color: pr.color,
                        hoist: false,
                        mentionable: true,
                        permissions: [],
                        reason: 'Nexus Blueprint: Ping role',
                    });
                    log.push(`✅ Ping role: \`${pr.name}\``);
                } catch (err) {
                    log.push(`❌ Failed ping: \`${pr.name}\` — ${err.message}`);
                }
            }

            await new Promise(r => setTimeout(r, 1000));

            // ═══════════════════════════════════════════
            // PHASE 2: CATEGORIES, CHANNELS, PERMISSIONS
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 2: SECTOR DEPLOYMENT ═══**');
            const overridesMap = buildCategoryOverrides(roleMap, guild.id);
            const channelTracker = {};
            const P = PermissionsBitField.Flags;

            for (const catDef of CATEGORIES) {
                const catOverrides = (overridesMap[catDef.name] || []).filter(o => o.id);

                // Add Muted deny to every category
                if (roleMap['🔇 Muted']) {
                    catOverrides.push({
                        id: roleMap['🔇 Muted'],
                        deny: [P.SendMessages, P.SendMessagesInThreads, P.AddReactions, P.CreatePublicThreads, P.CreatePrivateThreads, P.Speak]
                    });
                }

                let category;
                try {
                    category = await guild.channels.create({
                        name: catDef.name,
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: catOverrides,
                        reason: 'Nexus Blueprint: Category',
                    });
                    log.push(`📁 \`${catDef.name}\` — ${catOverrides.length} overrides`);
                } catch (err) {
                    log.push(`❌ Category failed: \`${catDef.name}\` — ${err.message}`);
                    continue;
                }

                for (const chDef of catDef.channels) {
                    try {
                        const ch = await guild.channels.create({
                            name: chDef.name,
                            type: chDef.type,
                            parent: category.id,
                            topic: chDef.topic || null,
                            reason: 'Nexus Blueprint: Channel',
                        });
                        channelTracker[chDef.name] = ch;
                    } catch (err) {
                        log.push(`  ❌ \`${chDef.name}\` — ${err.message}`);
                    }
                }
                const chCount = catDef.channels.length;
                log.push(`  └─ ${chCount} channels created`);
            }

            // ═══════════════════════════════════════════
            // PHASE 2B: SPECIAL CHANNEL OVERRIDES
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 2B: SPECIAL OVERRIDES ═══**');

            // Founders Vault: only Founder + Co-Founder
            if (channelTracker['👑-founders-vault']) {
                try {
                    await channelTracker['👑-founders-vault'].permissionOverwrites.set([
                        { id: guild.id, deny: [P.ViewChannel] },
                        ...(roleMap['👑 Founder'] ? [{ id: roleMap['👑 Founder'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.ManageMessages] }] : []),
                        ...(roleMap['🌟 Co-Founder'] ? [{ id: roleMap['🌟 Co-Founder'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.ManageMessages] }] : []),
                    ]);
                    log.push('🔒 Founders Vault: Locked to Founder + Co-Founder only');
                } catch (err) {
                    log.push(`⚠️ Founders Vault override: ${err.message}`);
                }
            }

            // Staff Voice: Moderator+ only
            if (channelTracker['🔒-staff-voice']) {
                try {
                    await channelTracker['🔒-staff-voice'].permissionOverwrites.set([
                        { id: guild.id, deny: [P.ViewChannel, P.Connect] },
                        ...(roleMap['⚔️ Moderator'] ? [{ id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.Connect, P.Speak] }] : []),
                        ...(roleMap['⚡ Head Moderator'] ? [{ id: roleMap['⚡ Head Moderator'], allow: [P.ViewChannel, P.Connect, P.Speak, P.MuteMembers, P.MoveMembers] }] : []),
                        ...(roleMap['🛡️ Admin'] ? [{ id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.Connect, P.Speak, P.MuteMembers, P.MoveMembers] }] : []),
                        ...(roleMap['💻 Developer'] ? [{ id: roleMap['💻 Developer'], allow: [P.ViewChannel, P.Connect, P.Speak] }] : []),
                    ]);
                    log.push('🔒 Staff Voice: Locked to Moderator+ only');
                } catch (err) {
                    log.push(`⚠️ Staff Voice override: ${err.message}`);
                }
            }

            // Partner Lounge: Partners only (+ staff inherit from category)
            if (channelTracker['🤝-partner-lounge']) {
                try {
                    const parentOverrides = channelTracker['🤝-partner-lounge'].parent?.permissionOverwrites.cache.map(o => ({
                        id: o.id, allow: o.allow.bitfield, deny: o.deny.bitfield
                    })) || [];
                    await channelTracker['🤝-partner-lounge'].permissionOverwrites.set([
                        ...parentOverrides,
                        ...(roleMap['🌐 Partner'] ? [{ id: roleMap['🌐 Partner'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] }] : []),
                    ]);
                    log.push('🔒 Partner Lounge: Partner access granted');
                } catch (err) {
                    log.push(`⚠️ Partner Lounge override: ${err.message}`);
                }
            }

            // Booster Lounge: Boosters + Level 50+ + Early Op
            if (channelTracker['💎-booster-lounge']) {
                try {
                    const parentOverrides = channelTracker['💎-booster-lounge'].parent?.permissionOverwrites.cache.map(o => ({
                        id: o.id, allow: o.allow.bitfield, deny: o.deny.bitfield
                    })) || [];
                    await channelTracker['💎-booster-lounge'].permissionOverwrites.set([
                        ...parentOverrides,
                        ...(roleMap['💎 Server Booster'] ? [{ id: roleMap['💎 Server Booster'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] }] : []),
                        ...(roleMap['🔥 Level 50+'] ? [{ id: roleMap['🔥 Level 50+'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] }] : []),
                        ...(roleMap['🥇 Early Operative'] ? [{ id: roleMap['🥇 Early Operative'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] }] : []),
                    ]);
                    log.push('🔒 Booster Lounge: Booster + Level 50+ + Early Op access');
                } catch (err) {
                    log.push(`⚠️ Booster Lounge override: ${err.message}`);
                }
            }

            // ═══════════════════════════════════════════
            // PHASE 3: SERVER SETTINGS
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 3: SERVER SETTINGS ═══**');
            try {
                const afk = channelTracker['💤-afk-lounge'];
                if (afk) {
                    await guild.setAFKChannel(afk);
                    await guild.setAFKTimeout(300);
                    log.push('✅ AFK → 💤-afk-lounge (5 min)');
                }
            } catch (err) {
                log.push(`⚠️ AFK: ${err.message}`);
            }

            // ═══════════════════════════════════════════
            // PHASE 4: POST CONTENT INTO CHANNELS
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 4: CONTENT DEPLOYMENT ═══**');

            // Rules
            if (channelTracker['📜-rules']) {
                try {
                    for (const rule of RULES_EMBEDS) {
                        await channelTracker['📜-rules'].send({
                            embeds: [new EmbedBuilder()
                                .setTitle(rule.title)
                                .setDescription(rule.description)
                                .setColor(rule.color)
                            ]
                        });
                    }
                    log.push('✅ Rules posted to #📜-rules');
                } catch (err) {
                    log.push(`❌ Rules: ${err.message}`);
                }
            }

            // Get Roles instructions
            if (channelTracker['🎭-get-roles']) {
                try {
                    for (const embed of GET_ROLES_EMBEDS) {
                        await channelTracker['🎭-get-roles'].send({
                            embeds: [new EmbedBuilder()
                                .setTitle(embed.title)
                                .setDescription(embed.description)
                                .setColor(embed.color)
                            ]
                        });
                    }
                    log.push('✅ Role setup guide posted to #🎭-get-roles');
                } catch (err) {
                    log.push(`❌ Get-roles: ${err.message}`);
                }
            }

            // Overview
            if (channelTracker['🧭-overview']) {
                try {
                    await channelTracker['🧭-overview'].send({
                        embeds: [new EmbedBuilder()
                            .setTitle(OVERVIEW_EMBED.title)
                            .setDescription(OVERVIEW_EMBED.description)
                            .setColor(OVERVIEW_EMBED.color)
                            .setFooter({ text: 'Nexus Protocol v11.0.0 // Apex' })
                        ]
                    });
                    log.push('✅ Overview posted to #🧭-overview');
                } catch (err) {
                    log.push(`❌ Overview: ${err.message}`);
                }
            }

            // Links
            if (channelTracker['🔗-links']) {
                try {
                    await channelTracker['🔗-links'].send({
                        embeds: [new EmbedBuilder()
                            .setTitle(LINKS_EMBED.title)
                            .setDescription(LINKS_EMBED.description)
                            .setColor(LINKS_EMBED.color)
                            .setFooter({ text: 'Nexus Protocol v11.0.0 // Apex' })
                        ]
                    });
                    log.push('✅ Links posted to #🔗-links');
                } catch (err) {
                    log.push(`❌ Links: ${err.message}`);
                }
            }

            // ═══════════════════════════════════════════
            // PHASE 5: REPORT
            // ═══════════════════════════════════════════
            const totalRoles = ROLES.length + PING_ROLES.length;
            const totalChannels = CATEGORIES.reduce((acc, c) => acc + c.channels.length, 0);
            const totalCategories = CATEGORIES.length;

            const logText = log.join('\n');
            const truncated = logText.length > 3500 ? logText.substring(0, 3500) + '\n...(truncated)' : logText;

            const summaryEmbed = new EmbedBuilder()
                .setTitle('⚡ NEXUS BLUEPRINT — DEPLOYMENT COMPLETE')
                .setDescription(
                    `**${guild.name}** has been fully rebuilt.\n\n` +
                    `📊 **${totalRoles}** roles · **${totalCategories}** categories · **${totalChannels}** channels\n` +
                    `🔐 Permission overrides applied to all categories\n` +
                    `📜 Rules, overview, links, and role guides posted\n\n` +
                    '```\n' + truncated + '\n```'
                )
                .setColor(0xD4A040)
                .setFooter({ text: 'Nexus Protocol v11.0.0 // Apex Blueprint' })
                .setTimestamp();

            const manualEmbed = new EmbedBuilder()
                .setTitle('📋 MANUAL SETUP REQUIRED')
                .setDescription([
                    'The bot **cannot** automate these. Complete them manually:\n',
                    '**1. Verification (Wick Bot)**',
                    '→ Add [Wick](https://wickbot.com) → Enable CAPTCHA in `#🔐-verification`',
                    '→ On pass: remove `🌑 New Entity`, assign `🧬 Operative`',
                    '→ Account age minimum: **7 days**',
                    '→ Raid threshold: **20+ joins in 60s → auto-lockdown**\n',
                    '**2. Anti-Bot (Beemo)**',
                    '→ Add [Beemo](https://beemo.gg) → Monitor Mode 7 days → Auto-Ban Mode',
                    '→ Log channel: `#🚨-security-feed`\n',
                    '**3. Self-Role Panels (Carl-bot)**',
                    '→ Add [Carl-bot](https://carl.gg) → Dashboard → Reaction Roles',
                    '→ In `#🎭-get-roles`, create the two panels shown in the channel',
                    '→ **Panel 1** (Dropdown): Announcements, Events, Changelog, Bug Pings, Feature Pings, Giveaway Pings',
                    '→ **Panel 2** (Buttons): Dev Interest, Design Interest, Beta Tester, Open to Partner, Gamer\n',
                    '**4. Welcome Messages (Carl-bot)**',
                    '→ Carl-bot → Welcome → Set channel to `#👋-welcome`',
                    '→ Design embed with rules link + role instructions\n',
                    '**5. Webhooks**',
                    '→ `#🆙-changelog` + `#🐙-github-feed`: GitHub repo → Settings → Webhooks',
                    '→ `#🟢-status`: UptimeRobot/BetterUptime webhook',
                    '→ `#📢-announcements`: Zapier for social media syndication\n',
                    '**6. Bot Configuration**',
                    '→ `/starboard setup` in server to set `#⭐-starboard`',
                    '→ `/config log-channel #🪵-mod-log`',
                    '→ `/config leveling on` + `/config level-channel #📈-level-ups`',
                    '→ `/config suggestions-channel #💡-suggestions`\n',
                    '**7. Assign Your Own Role**',
                    '→ In Server Settings → Roles, assign yourself `👑 Founder`',
                    '→ Assign your co-leads `🌟 Co-Founder`',
                ].join('\n'))
                .setColor(0xFFBD2E)
                .setFooter({ text: 'Complete these steps to finalize the blueprint.' });

            // Post to the first available text channel (bot-config or staff-general)
            const reportChannel = channelTracker['⚙️-bot-config'] || channelTracker['💬-staff-general'] || channelTracker['💬-general'];
            if (reportChannel) {
                try {
                    await reportChannel.send({ embeds: [summaryEmbed, manualEmbed] });
                    log.push('✅ Report posted to ' + reportChannel.name);
                } catch {}
            }

        } catch (error) {
            // Try to find any channel to report error
            const fallback = guild.channels.cache.find(c => c.type === ChannelType.GuildText);
            if (fallback) {
                await fallback.send({
                    embeds: [embedBuilder({
                        title: '💥 Blueprint Deployment Failed',
                        description: `\`\`\`\n${error.message}\n\`\`\`\n\n${log.join('\n').substring(0, 3000)}`,
                        color: '#ED4245'
                    })]
                }).catch(() => {});
            }
        }
    },
};
