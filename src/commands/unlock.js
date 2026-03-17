const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the current channel by restoring SendMessages for @everyone'),
    async execute(interaction) {
        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: null // Resets to default
            });

            logger.info(`${interaction.user.tag} unlocked channel #${channel.name}`);

            const embed = createEmbed({
                title: '🔓 Channel Unlocked',
                description: 'This channel has been unlocked. Everyone may speak again.',
                color: 0x57F287
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to unlock #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'Could not unlock the channel. Check my permissions (Manage Roles/Channels).',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
