const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
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
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (target.bot) return interaction.reply({ content: '❌ You cannot warn bots.', flags: [MessageFlags.Ephemeral] });
        if (target.id === interaction.user.id) return interaction.reply({ content: '❌ You cannot warn yourself.', flags: [MessageFlags.Ephemeral] });

        const warning = new Warning({
            userId: target.id,
            guildId: interaction.guild.id,
            adminId: interaction.user.id,
            reason: reason
        });

        await warning.save();

        
        const totalWarnings = await Warning.countDocuments({ userId: target.id, guildId: interaction.guild.id, active: true });

        await interaction.reply({
            embeds: [embedBuilder({
                title: '⚠️ Warning Issued',
                description: `**User:** ${target.tag} (\`${target.id}\`)\n**Reason:** ${reason}\n**Total Warnings:** \`${totalWarnings}\`\n**Moderator:** ${interaction.user.tag}`,
                color: '#F1C40F',
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })]
        });

        
        try {
            await target.send({
                embeds: [embedBuilder({
                    title: `⚠️ Warning — ${interaction.guild.name}`,
                    description: `You have been warned.\n**Reason:** ${reason}\n**Total Warnings:** \`${totalWarnings}\``,
                    color: '#F1C40F'
                })]
            });
        } catch (err) { /* DMs closed */ }
    },
};
