const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Initiates a total sector lockdown for unauthorized lifeforms.')
        ,
    async execute(interaction) {
        const channel = interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });

            logger.info(`${interaction.user.tag} locked channel #${channel.name}`);

            const embed = createEmbed({
                title: '🔒 Sector Lockdown Active',
                description: `\`[ALERT]\` Communication channels suspended. \nOnly high-clearance entities may transmit data.`,
                color: 0xED4245,
                footer: 'Nexus Security | SEC-LOCK-9'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to lock #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Lockdown Failed',
                    description: 'Protocol Error: Insufficient override permissions.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
