const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const durations = {
    '60': '1 Minute',
    '300': '5 Minutes',
    '600': '10 Minutes',
    '1800': '30 Minutes',
    '3600': '1 Hour',
    '86400': '1 Day',
    '604800': '1 Week',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout (mute) a user for a specified duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to timeout.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('How long to timeout.')
                .setRequired(true)
                .addChoices(
                    { name: '1 Minute', value: '60' },
                    { name: '5 Minutes', value: '300' },
                    { name: '10 Minutes', value: '600' },
                    { name: '30 Minutes', value: '1800' },
                    { name: '1 Hour', value: '3600' },
                    { name: '1 Day', value: '86400' },
                    { name: '1 Week', value: '604800' }
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const durationMs = parseInt(durationStr) * 1000;

        if (!target) {
            return interaction.reply({ content: '❌ User not found in this server.', flags: [MessageFlags.Ephemeral] });
        }
        if (!target.moderatable) {
            return interaction.reply({ content: '❌ I cannot timeout this user.', flags: [MessageFlags.Ephemeral] });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot timeout yourself.', flags: [MessageFlags.Ephemeral] });
        }

        try {
            await target.timeout(durationMs, reason);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🔇 User Timed Out',
                    description: `**User:** ${target.user.tag}\n**Duration:** ${durations[durationStr]}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#E67E22',
                    thumbnail: target.user.displayAvatarURL({ dynamic: true })
                })]
            });
        } catch (err) {
            await interaction.reply({ content: `❌ Timeout failed: \`${err.message}\``, flags: [MessageFlags.Ephemeral] });
        }
    },
};
