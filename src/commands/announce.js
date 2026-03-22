const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Broadcast an announcement through the Nexus. (Owner Only)')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The announcement message to broadcast.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to send to (default: current channel).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Embed color (hex, e.g. #FF0000)')
                .setRequired(false)),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const color = interaction.options.getString('color') || '#00FFCC';

        const embed = createEmbed({
            title: '📢 NEXUS BROADCAST',
            description: message,
            color: color,
            footer: 'Nexus Protocol — Official Announcement'
        });

        try {
            await channel.send({ embeds: [embed] });

            const confirmEmbed = createEmbed({
                title: '✅ Broadcast Sent',
                description: `Announcement delivered to ${channel}.`,
                color: '#00FF88',
                footer: `Sent by ${interaction.user.tag}`
            });

            await interaction.reply({ embeds: [confirmEmbed], flags: 64 });
        } catch (error) {
            await interaction.reply({ content: `\`[ERROR]\` Failed to send: ${error.message}`, flags: 64 });
        }
    },
};
