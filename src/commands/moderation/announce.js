const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement embed to a specified channel.')
        .addChannelOption(opt =>
            opt.setName('channel')
                .setDescription('The channel to send the announcement to.')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('message')
                .setDescription('The announcement message.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    cooldown: 10,
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        const embed = embedBuilder({
            title: '📢 Announcement',
            description: message,
            footer: `Dispatched by ${interaction.user.username}`
        });

        try {
            await channel.send({ embeds: [embed] });
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '✅ Announcement Dispatched',
                    description: `Your announcement has been sent to ${channel}.`,
                    color: '#00FF88'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        } catch (error) {
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Dispatch Failed',
                    description: 'Could not send the announcement. Verify channel permissions.',
                    color: '#FF4444'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
