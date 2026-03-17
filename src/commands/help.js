const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
    ComponentType
} = require('discord.js');
const { createEmbed } = require('../utils/embed');

const CATEGORIES = {
    utility: {
        label: 'Nexus Utilities',
        description: 'Core system tools and diagnostics.',
        emoji: '🔧',
        commands: [
            { name: 'ping', desc: 'Checks the bot\'s network status and latency pulse.' },
            { name: 'info', desc: 'Displays a core specification scan of the Nexus.' },
            { name: 'serverinfo', desc: 'Displays detailed encryption and sector data.' },
            { name: 'userinfo', desc: 'Initiates a biometric scan on a specified entity.' },
            { name: 'avatar', desc: 'Retrieves high-fidelity visual iconography.' },
            { name: 'math', desc: 'Executes complex neural computations.' },
            { name: 'timer', desc: 'Sets a temporal countdown anchor.' }
        ]
    },
    economy: {
        label: 'Financial Matrix',
        description: 'Manage Nexus credits and assets.',
        emoji: '💰',
        commands: [
            { name: 'balance', desc: 'Check current credit reserves and net worth.' },
            { name: 'daily', desc: 'Claim your 24-hour credit allocation.' },
            { name: 'work', desc: 'Submit a labor packet to earn credits.' },
            { name: 'rob', desc: 'Risk a breach to siphon credits from others.' },
            { name: 'transfer', desc: 'Execute a secure credit transaction.' },
            { name: 'leaderboard', desc: 'Displays the top 10 richest entities.' },
            { name: 'shop', desc: 'View the credit exchange catalog.' },
            { name: 'buy', desc: 'Purchase an asset from the exchange.' },
            { name: 'inventory', desc: 'View your secure asset storage.' }
        ]
    },
    casino: {
        label: 'Probability Casino',
        description: 'Bet credits on high-risk sequences.',
        emoji: '🎰',
        commands: [
            { name: 'blackjack', desc: 'Challenge the dealer in a risk-reward matrix.' },
            { name: 'slots', desc: 'Test your luck against the RNG modules.' }
        ]
    },
    leveling: {
        label: 'Neural Progression',
        description: 'Track XP and rank metrics.',
        emoji: '📈',
        commands: [
            { name: 'rank', desc: 'Displays your current neural level and XP pulse.' }
        ]
    },
    moderation: {
        label: 'Sector Security',
        description: 'Enforcement tools for sector admins.',
        emoji: '🛡️',
        commands: [
            { name: 'ban', desc: 'Terminate an entity\'s access permanently.' },
            { name: 'kick', desc: 'Expel an entity from the sector.' },
            { name: 'purge', desc: 'Wipe multiple transmission logs.' },
            { name: 'lock', desc: 'Execute a sector-wide transmission lock.' },
            { name: 'unlock', desc: 'Restore standard transmission protocols.' },
            { name: 'slowmode', desc: 'Adjust transmission throttling delays.' },
            { name: 'verify-setup', desc: 'Deploy a biometric verification node.' }
        ]
    },
    fun: {
        label: 'Recreation Modules',
        description: 'Entertainment and probability sequences.',
        emoji: '🎲',
        commands: [
            { name: '8ball', desc: 'Consult the Nexus Oracle for predictions.' },
            { name: 'coinflip', desc: 'Execute a binary probability sequence.' },
            { name: 'roll', desc: 'Roll a multi-sided randomization module.' },
            { name: 'rps', desc: 'Initiate a conflict resolution sequence.' },
            { name: 'trivia', desc: 'Initiate a neural data retrieval game.' }
        ]
    },
    media: {
        label: 'Intelligence & Media',
        description: 'Retrieval of scans and data packets.',
        emoji: '📸',
        commands: [
            { name: 'cat', desc: 'Retrieve a random feline biometric asset.' },
            { name: 'dog', desc: 'Retrieve a random canine biometric asset.' },
            { name: 'meme', desc: 'Fetch a top-rated cultural data packet (Meme).' }
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Interface access. Browse the Nexus Directory Matrix.'),
    async execute(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a system matrix...')
            .addOptions(
                Object.entries(CATEGORIES).map(([id, data]) => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(data.label)
                        .setDescription(data.description)
                        .setValue(id)
                        .setEmoji(data.emoji)
                )
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const initialEmbed = createEmbed({
            title: '💿 Nexus Directory Matrix',
            description: `\`[SYSTEM READY]\` \nSelect a command module from the dropdown below to view available functions.`,
            color: '#00FFCC',
            footer: 'Directory interface active for 3 minutes.'
        });

        const response = await interaction.reply({ 
            embeds: [initialEmbed], 
            components: [row],
            withResponse: true 
        }).then(i => i.resource ? i.resource.message : i.fetchReply());

        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect, 
            time: 180000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '\`[UNAUTHORIZED]\` Access restricted to directory initiator.', flags: 64 });
            }

            const categoryId = i.values[0];
            const categoryData = CATEGORIES[categoryId];

            const fields = categoryData.commands.map(cmd => ({
                name: `/${cmd.name}`,
                value: `↳ ${cmd.desc}`,
                inline: false
            }));

            const categoryEmbed = createEmbed({
                title: `${categoryData.emoji} ${categoryData.label}`,
                description: `*${categoryData.description}*`,
                fields: fields,
                color: '#00FFCC',
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
