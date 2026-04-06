const { Events, InteractionType } = require('discord.js');
const logger = require('../../utils/logger');
const embedBuilder = require('../../utils/embedBuilder');
const BlacklistEntry = require('../../models/BlacklistEntry');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // Blacklist Check
        try {
            const isBlacklisted = await BlacklistEntry.findOne({ targetId: interaction.user.id });
            if (isBlacklisted) {
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: 'Access Denied',
                        description: `You are blacklisted from using the Nexus Protocol.\n**Reason:** ${isBlacklisted.reason}`,
                        color: '#ED4245'
                    })],
                    ephemeral: true
                });
            }
        } catch (err) {
            logger.error('Blacklist check failed:', err);
        }

        // Execute Command
        try {
            await command.execute(interaction, client);
        } catch (error) {
            logger.error(`Error executing ${interaction.commandName}:`, error);

            const errEmbed = embedBuilder({
                title: 'Execution Error',
                description: 'There was an internal error while executing this command. The developers have been notified.',
                color: '#ED4245'
            });

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }
        }
    },
};
