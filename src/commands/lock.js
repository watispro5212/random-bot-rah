const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the current channel by denying SendMessages for @everyone'),
    async execute(interaction) {
        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });

            logger.info(`${interaction.user.tag} locked channel #${channel.name}`);

            const embed = createEmbed({
                title: '🔒 Channel Locked',
                description: 'This channel has been locked by a moderator. Only authorized roles may speak.',
                color: 0xED4245
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to lock #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'Could not lock the channel. Check my permissions (Manage Roles/Channels).',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
