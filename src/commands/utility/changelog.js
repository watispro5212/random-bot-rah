const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('View the latest development milestones and protocol updates.'),
    cooldown: 5,
    async execute(interaction, client) {
        await interaction.reply({
            embeds: [embedBuilder({
                title: 'Nexus v12.0.0 // Apex Overhaul',
                description: 'The most advanced update yet — 8 new commands, infrastructure upgrades, and a complete visual redesign.',
                fields: [
                    { 
                        name: '🎮 New Game Commands', 
                        value: '`/wordle` `/connect4` — Full interactive games with emoji displays and button controls.' 
                    },
                    { 
                        name: '💰 Economy Expansion', 
                        value: '`/gamble` `/slots` — New gambling commands with visual dice rolls and slot machine reels.' 
                    },
                    { 
                        name: '🛡️ Moderation Arsenal', 
                        value: '`/lockdown` `/slowall` — Server-wide emergency controls for rapid response.' 
                    },
                    { 
                        name: '⭐ Community Systems', 
                        value: '`/suggest` `/starboard` — Suggestion voting and auto-highlight popular messages.' 
                    },
                    {
                        name: '⚡ Infrastructure',
                        value: 'In-memory TTL cache layer for GuildConfig, reducing MongoDB queries by ~80% on active servers.'
                    },
                    {
                        name: '📜 Full Archive',
                        value: '[View the complete changelog →](https://shiny-giigles.pages.dev/changelog.html)'
                    }
                ],
                footer: 'Nexus Protocol v12.0.0 • Apex Archive'
            })]
        });
    },
};
