const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const warns = require('../utils/WarningManager');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Issues a formal warning to a user.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        if (target.bot) {
            return interaction.reply({ content: 'You cannot warn bots!', flags: 64 });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot warn yourself!', flags: 64 });
        }

        warns.addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
        const count = warns.getWarnings(interaction.guild.id, target.id).length;

        logger.info(`${interaction.user.tag} warned ${target.tag} in ${interaction.guild.name} (Strike ${count})`);

        // Try to DM the user
        try {
            await target.send({
                embeds: [createEmbed({
                    title: `⚠️ You received a warning in ${interaction.guild.name}`,
                    description: `**Reason:** ${reason}\n\n*This is warning #${count} on your record.*`,
                    color: '#FFCC00'
                })]
            });
        } catch (err) {
            // Couldn't DM
        }

        const embed = createEmbed({
            title: '⚠️ User Warned',
            description: `Successfully warned <@${target.id}>.\nThey now have **${count}** warning(s).`,
            fields: [
                { name: 'Reason', value: reason, inline: false }
            ],
            color: '#FFCC00'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
