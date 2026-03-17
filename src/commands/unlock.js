const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Restores standard communication protocols to the current sector.')
        ,
    async execute(interaction) {
        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: null // Resets to default
            });

            logger.info(`${interaction.user.tag} unlocked channel #${channel.name}`);

            const embed = createEmbed({
                title: '🔓 Sector Lockdown Terminated',
                description: `\`[SYSTEM]\` standard transmission protocols restored. \nCommunication channels are now functional for all entities.`,
                color: 0x57F287,
                footer: 'Nexus Security | SEC-SYS-RESTORE'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to unlock #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Override Failed',
                    description: 'Protocol Error: Could not restore sector links. Check override permissions.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
