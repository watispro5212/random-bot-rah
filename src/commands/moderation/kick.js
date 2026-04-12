const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!target) {
            return interaction.reply({ content: '❌ User not found in this server.', flags: [MessageFlags.Ephemeral] });
        }
        if (!target.kickable) {
            return interaction.reply({ content: '❌ I cannot kick this user — their role is higher than mine.', flags: [MessageFlags.Ephemeral] });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot kick yourself.', flags: [MessageFlags.Ephemeral] });
        }

        
        try {
            await target.send({
                embeds: [embedBuilder({
                    title: `👢 Kicked from ${interaction.guild.name}`,
                    description: `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#E67E22'
                })]
            });
        } catch (err) { /* DMs closed */ }

        try {
            await target.kick(reason);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '👢 User Kicked',
                    description: `**User:** ${target.user.tag} (\`${target.id}\`)\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#E67E22',
                    thumbnail: target.user.displayAvatarURL({ dynamic: true })
                })]
            });
        } catch (err) {
            await interaction.reply({ content: `❌ Kick failed: \`${err.message}\``, flags: [MessageFlags.Ephemeral] });
        }
    },
};
