const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel — restore public messaging.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unlocking the channel.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🔓 Channel Unlocked',
                    description: `This channel has been unlocked.\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`,
                    color: '#2ECC71'
                })]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Unlock Failed',
                    description: 'Could not modify channel permissions. Check bot role hierarchy.',
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
