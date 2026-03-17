const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a segment of the current channel\'s data history.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of data packets (messages) to delete (1-100).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        ,
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        
        await interaction.deferReply({ flags: 64 });

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            const deleted = await interaction.channel.bulkDelete(fetched, true);
            
            logger.info(`${interaction.user.tag} purged ${deleted.size} messages in #${interaction.channel.name}`);

            await interaction.editReply({
                embeds: [createEmbed({
                    title: '🗑️ Data Purge Successful',
                    description: `\`[ERASURE]\` Successfully wiped **${deleted.size}** packets from the history stream.`,
                    color: 0x57F287,
                    footer: 'Nexus Channel Maintenance | PAC-DEL-COMPLETE'
                })]
            });
        } catch (error) {
            logger.error(`Failed to purge messages in #${interaction.channel.name}: ${error}`);
            await interaction.editReply({
                embeds: [createEmbed({
                    title: '❌ Purge Anomaly',
                    description: 'Protocol Error: Failed to erase data packets. Ancient packets (>14 days) are immutable by this protocol.',
                    color: 0xED4245
                })]
            });
        }
    },
};
