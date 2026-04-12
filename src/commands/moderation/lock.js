const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel — prevent public messages.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for locking the channel.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🔒 Channel Locked',
                    description: `This channel has been locked.\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#ED4245'
                })]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Lock Failed',
                    description: 'Could not modify channel permissions. Check bot role hierarchy.',
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
