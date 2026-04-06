const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Issue a formal warning to a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to warn.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the warning.')
                .setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (target.bot) return interaction.reply({ content: 'You cannot warn bots.', ephemeral: true });

        const warning = new Warning({
            userId: target.id,
            guildId: interaction.guild.id,
            adminId: interaction.user.id,
            reason: reason
        });

        await warning.save();

        const warnEmbed = embedBuilder({
            title: 'User Warned',
            description: `**User:** ${target.tag}\n**Reason:** ${reason}\n**Admin:** ${interaction.user.tag}`,
            color: '#F1C40F',
            thumbnail: target.displayAvatarURL({ dynamic: true })
        });

        await interaction.reply({ embeds: [warnEmbed] });

        // Try to DM the user
        try {
            await target.send({
                embeds: [embedBuilder({
                    title: `Formal Warning: ${interaction.guild.name}`,
                    description: `You have received a warning.\n**Reason:** ${reason}`,
                    color: '#F1C40F'
                })]
            });
        } catch (err) {
            // Silently fail if DM's are closed
        }
    },
};
