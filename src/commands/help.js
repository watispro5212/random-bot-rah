const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
    ComponentType
} = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');
const { replyWithMessage } = require('../utils/replyMessage');

const CATEGORIES = {
    utility: {
        label: 'Nexus Utilities',
        description: 'Core system tools and diagnostics.',
        emoji: '🔧',
        commands: [
            { name: 'ping', desc: 'Checks the bot\'s network status and latency pulse.' },
            { name: 'invite', desc: 'Get a link to add Nexus to another server.' },
            { name: 'uptime', desc: 'Show process uptime, session, gateway ping, and shard info.' },
            { name: 'info', desc: 'Displays a core specification scan of the Nexus.' },
            { name: 'serverinfo', desc: 'Displays detailed encryption and sector data.' },
            { name: 'userinfo', desc: 'Initiates a biometric scan on a specified entity.' },
            { name: 'avatar', desc: 'Retrieves high-fidelity visual iconography.' },
            { name: 'servericon', desc: 'Extracts the high-resolution icon of the current node.' },
            { name: 'math', desc: 'Executes complex neural computations.' },
            { name: 'timer', desc: 'Sets a temporal countdown anchor.' },
            { name: 'remind', desc: 'Have the system keep tabs on something for you.' },
            { name: 'poll', desc: 'Fire up a quick community consensus vote.' },
            { name: 'translate', desc: 'Translate text across language protocols.' },
            { name: 'weather', desc: 'Pull atmospheric data for a location.' },
            { name: 'profile', desc: 'View a comprehensive operative dossier.' }
        ]
    },
    economy: {
        label: 'Financial Matrix',
        description: 'Manage Nexus credits and assets.',
        emoji: '💰',
        commands: [
            { name: 'balance', desc: 'Check current credit reserves and net worth.' },
            { name: 'daily', desc: 'Claim your 24-hour credit allocation (streak bonus!).' },
            { name: 'work', desc: 'Submit a labor packet to earn credits (scales with level).' },
            { name: 'rob', desc: 'Risk a breach to siphon credits from others.' },
            { name: 'transfer', desc: 'Execute a secure credit transaction.' },
            { name: 'leaderboard', desc: 'Displays the top 10 richest entities.' },
            { name: 'shop', desc: 'View the credit exchange catalog.' },
            { name: 'buy', desc: 'Purchase an asset from the exchange.' },
            { name: 'inventory', desc: 'View your secure asset storage.' },
            { name: 'quests', desc: 'Accept daily sub-routines for credit bounties.' }
        ]
    },
    casino: {
        label: 'Probability Casino',
        description: 'Bet credits on high-risk sequences.',
        emoji: '🎰',
        commands: [
            { name: 'blackjack', desc: 'Challenge the dealer in a risk-reward matrix.' },
            { name: 'slots', desc: 'Test your luck against the RNG modules.' },
            { name: 'coinflip', desc: 'Execute a boolean 50/50 algorithm.' }
        ]
    },
    leveling: {
        label: 'Neural Progression',
        description: 'Track XP and rank metrics.',
        emoji: '📈',
        commands: [
            { name: 'rank', desc: 'Displays your current neural level and XP pulse (rank card).' },
        ]
    },
    moderation: {
        label: 'Sector Security',
        description: 'Enforcement tools for sector admins.',
        emoji: '🛡️',
        commands: [
            { name: 'ban', desc: 'Terminate an entity\'s access permanently.' },
            { name: 'kick', desc: 'Expel an entity from the sector.' },
            { name: 'warn', desc: 'Issue a formal protocol strike to an entity.' },
            { name: 'purge', desc: 'Wipe multiple transmission logs.' },
            { name: 'lock', desc: 'Execute a sector-wide transmission lock.' },
            { name: 'unlock', desc: 'Restore standard transmission protocols.' },
            { name: 'slowmode', desc: 'Adjust transmission throttling delays.' },
            { name: 'say', desc: 'Transmit a cleartext message through the Nexus.' },
            { name: 'verify-setup', desc: 'Deploy a biometric verification node.' },
            { name: 'ticket-setup', desc: 'Deploy a support ticket interface.' },
            { name: 'automod-setup', desc: 'Configure automatic spam and content filters.' },
            { name: 'log-setup', desc: 'Route moderation audit logs to a channel.' },
            { name: 'starboard-setup', desc: 'Archive highly-reacted messages to a channel.' }
        ]
    },
    fun: {
        label: 'Recreation Modules',
        description: 'Entertainment and probability sequences.',
        emoji: '🎲',
        commands: [
            { name: '8ball', desc: 'Consult the Nexus Oracle for predictions.' },
            { name: 'roll', desc: 'Roll a multi-sided randomization module.' },
            { name: 'rps', desc: 'Initiate a conflict resolution sequence.' },
            { name: 'trivia', desc: 'Initiate a neural data retrieval game.' },
            { name: 'hack', desc: 'Initiate a harmless penetration test on a target.' },
            { name: 'emojify', desc: 'Convert text data into an encrypted emoji string.' },
            { name: 'joke', desc: 'Process a humorous data packet.' },
            { name: 'fact', desc: 'Extract an interesting file from the database.' },
            { name: 'quote', desc: 'Extract an inspirational transmission.' }
        ]
    },
    advanced: {
        label: 'Advanced Operations',
        description: 'Elite-tier protocols and system intel.',
        emoji: '⚡',
        commands: [
            { name: 'cyber-heist', desc: 'Execute a high-stakes multi-phase heist operation.' },
            { name: 'giveaway', desc: 'Airdrop credits or resources to the community.' },
            { name: 'network-stats', desc: 'Display real-time shard and gateway diagnostics.' },
            { name: 'shards', desc: 'View active shard processes and their health.' }
        ]
    },
    media: {
        label: 'Intelligence & Media',
        description: 'Retrieval of scans and data packets.',
        emoji: '📸',
        commands: [
            { name: 'cat', desc: 'Retrieve a random feline biometric asset.' },
            { name: 'dog', desc: 'Retrieve a random canine biometric asset.' },
            { name: 'meme', desc: 'Fetch a top-rated cultural data packet (Meme).' },
            { name: 'urban', desc: 'Query the Urban data archives for slang definitions.' }
        ]
    },
    glossary: {
        label: 'Nexus Terminology',
        description: 'Glossary for technical system classifications.',
        emoji: '🧠',
        commands: [
            { name: 'Shard', desc: 'An isolated bot process instance for network scaling.' },
            { name: 'Latency', desc: 'The temporal delay in data transmission pulses (Ping).' },
            { name: 'Node', desc: 'A specific processing unit or server within the Nexus.' },
            { name: 'Protocol', desc: 'A standardized set of rules for neural data exchange.' },
            { name: 'Uplink', desc: 'A communication bridge to higher-level API systems.' },
            { name: 'Neural Level', desc: 'A measure of an Operative\'s clearance and activity.' },
            { name: 'Firewall', desc: 'A defensive barrier monitoring incoming data vectors.' },
            { name: 'Breach', desc: 'An unauthorized security bypass or system intrusion.' },
            { name: 'Cyber-Heist', desc: 'A high-stakes operation to siphon restricted credits.' },
            { name: 'Biometric', desc: 'Unique biological signatures used for entity scans.' },
            { name: 'Sync', desc: 'Aligning local state with the global Nexus database.' },
            { name: 'Callback', desc: 'A functional trigger returned after a process completes.' },
            { name: 'Gateway', desc: 'The entry point for all neural transmissions to Discord.' },
            { name: 'Websocket', desc: 'A persistent, bidirectional data stream protocol.' },
            { name: 'Shard ID', desc: 'The unique identifier for a specific bot instance.' },
            { name: 'Cluster', desc: 'A collection of shards operating on the same hardware.' },
            { name: 'Env', desc: 'System variables defining the operative environment config.' },
            { name: 'API Key', desc: 'A cryptographic token used for authorized access.' },
            { name: 'Webhook', desc: 'An automated data push to a specific sector endpoint.' },
            { name: 'Packet', desc: 'A discrete unit of data transmitted over the network.' },
            { name: 'Handshake', desc: 'The initial cryptographic greeting between two nodes.' },
            { name: 'SSL', desc: 'Secure Sockets Layer — encryption for protocol safety.' }
        ]
    }
};

// Owner-only category — hidden from regular players
const OWNER_CATEGORY = {
    owner: {
        label: '🔒 Root Access Panel',
        description: 'Owner-only system override commands.',
        emoji: '🔐',
        commands: [
            { name: 'shutdown', desc: 'Emergency shutdown all Nexus shard processes.' },
            { name: 'eval', desc: 'Execute raw JavaScript in the Nexus core runtime.' },
            { name: 'set-credits', desc: 'Override an operative\'s wallet or bank balance.' },
            { name: 'set-level', desc: 'Override an operative\'s neural level and XP.' },
            { name: 'announce', desc: 'Broadcast an official announcement through the Nexus.' },
            { name: 'blacklist', desc: 'Sever an operative from using the Nexus entirely.' },
            { name: 'server-list', desc: 'Display all sectors running the Nexus Protocol.' },
            { name: 'reload', desc: 'Hot-reload a command module without restarting.' }
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Interface access. Browse the Nexus Directory Matrix.'),
    async execute(interaction) {
        // Build categories object — include owner panel only for the owner
        const userIsOwner = isOwner(interaction.user.id);
        const visibleCategories = userIsOwner 
            ? { ...CATEGORIES, ...OWNER_CATEGORY } 
            : CATEGORIES;

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a system matrix...')
            .addOptions(
                Object.entries(visibleCategories).map(([id, data]) => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(data.label)
                        .setDescription(data.description)
                        .setValue(id)
                        .setEmoji(data.emoji)
                )
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const totalCommands = Object.values(visibleCategories).reduce((sum, cat) => sum + cat.commands.length, 0);
        const totalModules = Object.keys(visibleCategories).length;

        const initialEmbed = createEmbed({
            title: userIsOwner ? '💿 Nexus Directory Matrix — ROOT ACCESS' : '💿 Nexus Directory Matrix',
            description: `\`[SYSTEM READY]\` \nSelect a command module from the dropdown below to view available functions.\n\n**${totalCommands}** total protocols across **${totalModules}** modules.${userIsOwner ? '\n\n🔐 *Root Access Panel unlocked.*' : ''}`,
            color: userIsOwner ? '#FF0000' : '#00FFCC',
            footer: 'Directory interface active for 3 minutes.'
        });

        const response = await replyWithMessage(interaction, {
            embeds: [initialEmbed],
            components: [row],
        });

        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect, 
            time: 180000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '\`[UNAUTHORIZED]\` Access restricted to directory initiator.', flags: 64 });
            }

            const categoryId = i.values[0];
            const categoryData = visibleCategories[categoryId];

            if (!categoryData) {
                return i.reply({ content: '`[ERROR]` Category not found.', flags: 64 });
            }

            const fields = categoryData.commands.map(cmd => ({
                name: categoryId === 'glossary' ? `📖 ${cmd.name}` : categoryId === 'owner' ? `🔒 /${cmd.name}` : `/${cmd.name}`,
                value: `↳ ${cmd.desc}`,
                inline: false
            }));

            const categoryEmbed = createEmbed({
                title: `${categoryData.emoji} ${categoryData.label}`,
                description: `*${categoryData.description}*`,
                fields: fields,
                color: categoryId === 'owner' ? '#FF0000' : '#00FFCC',
                footer: `Showing ${fields.length} available protocols`
            });

            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on('end', async () => {
            selectMenu.setDisabled(true);
            const disabledRow = new ActionRowBuilder().addComponents(selectMenu);
            
            await interaction.editReply({ 
                components: [disabledRow] 
            }).catch(() => null);
        });
    },
};
