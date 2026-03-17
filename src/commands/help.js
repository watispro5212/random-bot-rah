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
        label: 'Utility Commands',
        description: 'General bot and server information',
        emoji: '🔧',
        commands: [
            { name: 'ping', desc: 'Checks the bot\'s network status and latency metrics' },
            { name: 'info', desc: 'Displays information about the bot and the current server' },
            { name: 'serverinfo', desc: 'Displays detailed information about the current server' },
            { name: 'userinfo', desc: 'Displays detailed information about a user' },
            { name: 'avatar', desc: 'Displays a user\'s avatar in high resolution' },
            { name: 'math', desc: 'Evaluates a mathematical expression' },
            { name: 'timer', desc: 'Sets a countdown timer' }
        ]
    },
    economy: {
        label: 'Economy & Finance',
        description: 'Earn, manage, and steal credits!',
        emoji: '💰',
        commands: [
            { name: 'balance', desc: 'Check your current account balance and net worth' },
            { name: 'daily', desc: 'Claim your 24-hour reward and build streaks' },
            { name: 'work', desc: 'Work a random shift to earn some credits' },
            { name: 'rob', desc: 'Risk it all and attempt to steal from a user' },
            { name: 'transfer', desc: 'Safely transfer credits to another user' },
            { name: 'leaderboard', desc: 'Displays the top 10 richest users based on net worth' },
            { name: 'shop', desc: 'View the item shop catalog' },
            { name: 'buy', desc: 'Buy an item from the shop' },
            { name: 'inventory', desc: 'View your purchased items' }
        ]
    },
    casino: {
        label: 'Casino & High Rollers',
        description: 'Gamble your credits away!',
        emoji: '🎰',
        commands: [
            { name: 'blackjack', desc: 'Play a game of Blackjack against the dealer' },
            { name: 'slots', desc: 'Bet your credits on the slot machine' }
        ]
    },
    leveling: {
        label: 'Leveling System',
        description: 'Track your XP and Rank',
        emoji: '📈',
        commands: [
            { name: 'rank', desc: 'Displays your current Level and XP progress' }
        ]
    },
    moderation: {
        label: 'Moderation Commands',
        description: 'Tools for server administrators',
        emoji: '🛡️',
        commands: [
            { name: 'ban', desc: 'Ban a user from the server' },
            { name: 'kick', desc: 'Kick a user from the server' },
            { name: 'purge', desc: 'Bulk delete messages in the current channel' },
            { name: 'lock', desc: 'Locks the current channel (@everyone cannot send messages)' },
            { name: 'unlock', desc: 'Unlocks the current channel' },
            { name: 'slowmode', desc: 'Sets the channel slowmode duration' },
            { name: 'verify-setup', desc: 'Drops a verification panel (Admin Only)' }
        ]
    },
    fun: {
        label: 'Fun & Games',
        description: 'Games and entertainment',
        emoji: '🎲',
        commands: [
            { name: '8ball', desc: 'Ask the Magic 8-Ball a yes/no question' },
            { name: 'coinflip', desc: 'Flips a coin returning Heads or Tails' },
            { name: 'roll', desc: 'Rolls a die (default 6 sides)' },
            { name: 'rps', desc: 'Play Rock, Paper, Scissors against the bot' },
            { name: 'trivia', desc: 'Answer a random trivia question' }
        ]
    },
    media: {
        label: 'Images & Media',
        description: 'Cute animals and fresh memes',
        emoji: '📸',
        commands: [
            { name: 'cat', desc: 'Fetches a random picture of a cute cat' },
            { name: 'dog', desc: 'Fetches a random picture of a cute dog' },
            { name: 'meme', desc: 'Fetches a random top meme' }
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Interface access. Browse the Nexus command modules.'),
    async execute(interaction) {
        
        // Build the dropdown menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Select a system module...')
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

        // Initial embed
        const initialEmbed = createEmbed({
            title: '💿 Nexus Interface | Directory',
            description: 'Select a command module from the dropdown below to view available functions.',
            color: '#00FFCC',
            footer: 'Module interface active for 3 minutes.'
        });

        const response = await interaction.reply({ 
            embeds: [initialEmbed], 
            components: [row],
            withResponse: true 
        });

        // Setup component collector for the dropdown
        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect, 
            time: 180000 // 3 minutes
        });

        collector.on('collect', async i => {
            // Only allow the original unvoker to use the dropdown
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Unauthorized access. This interface is locked to the original user.', flags: 64 });
            }

            const categoryId = i.values[0];
            const categoryData = CATEGORIES[categoryId];

            // Build fields from commands
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
                footer: `Showing ${fields.length} commands`
            });

            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on('end', async () => {
            // Disable the dropdown when time expires
            selectMenu.setDisabled(true);
            const disabledRow = new ActionRowBuilder().addComponents(selectMenu);
            
            await interaction.editReply({ 
                components: [disabledRow] 
            }).catch(() => null); // Catch if message was deleted
        });
    },
};
