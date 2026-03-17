const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages in the current channel.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        
        await interaction.deferReply({ flags: 64 });

        try {
            // Fetch messages to delete
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            
            // Delete messages (true filters out messages older than 14 days which would throw an error)
            const deleted = await interaction.channel.bulkDelete(fetched, true);
            
            logger.info(`${interaction.user.tag} purged ${deleted.size} messages in #${interaction.channel.name}`);

            await interaction.editReply({
                embeds: [createEmbed({
                    title: '🗑️ Messages Purged',
                    description: `Successfully deleted **${deleted.size}** messages.`,
                    color: 0x57F287, // Green SUCCESS color
                })]
            });
        } catch (error) {
            logger.error(`Failed to purge messages in #${interaction.channel.name}: ${error}`);
            await interaction.editReply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'An error occurred while purging messages. Messages older than 14 days cannot be bulk deleted.',
                    color: 0xED4245
                })]
            });
        }
    },
};
