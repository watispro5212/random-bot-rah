const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permanently ban a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban.')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_days')
                .setDescription('Days of messages to delete (0-7).')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const deleteDays = interaction.options.getInteger('delete_days') || 0;

        if (!target) {
            return interaction.reply({ content: '❌ That user is not in this server.', flags: [MessageFlags.Ephemeral] });
        }

        if (!target.bannable) {
            return interaction.reply({ content: '❌ I cannot ban this user — their role is higher than mine.', flags: [MessageFlags.Ephemeral] });
        }

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot ban yourself.', flags: [MessageFlags.Ephemeral] });
        }

        
        try {
            await target.send({
                embeds: [embedBuilder({
                    title: `🔨 Banned from ${interaction.guild.name}`,
                    description: `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#ED4245'
                })]
            });
        } catch (err) { /* DMs closed */ }

        try {
            await target.ban({ reason, deleteMessageSeconds: deleteDays * 86400 });

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🔨 User Banned',
                    description: `**User:** ${target.user.tag} (\`${target.id}\`)\n**Reason:** ${reason}\n**Messages Deleted:** ${deleteDays} days\n**Moderator:** ${interaction.user.tag}`,
                    color: '#ED4245',
                    thumbnail: target.user.displayAvatarURL({ dynamic: true })
                })]
            });
        } catch (err) {
            await interaction.reply({ content: `❌ Ban failed: \`${err.message}\``, flags: [MessageFlags.Ephemeral] });
        }
    },
};
