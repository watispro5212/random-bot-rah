const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode delay for the current channel.')
        .addIntegerOption(option => 
            option.setName('seconds')
                .setDescription('The slowmode duration in seconds (0 to disable).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)) // Discord max is 6 hours,
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        const channel = interaction.channel;

        try {
            await channel.setRateLimitPerUser(seconds);

            logger.info(`${interaction.user.tag} set slowmode in #${channel.name} to ${seconds}s`);

            const desc = seconds === 0 
                ? '🐇 Slowmode has been disabled.' 
                : `🐢 Slowmode is now active. Members must wait **${seconds} seconds** between messages.`;

            const embed = createEmbed({
                title: '⏱️ Slowmode Updated',
                description: desc,
                color: '#00FFCC'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to set slowmode in #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'Could not set slowmode. Check my channel permissions.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
