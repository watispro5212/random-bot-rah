const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Retrieve the last deleted message in this channel.'),
    cooldown: 10,
    async execute(interaction, client) {
        const snipe = client.snipes?.get(interaction.channelId);

        if (!snipe) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '🔍 Snipe Failed',
                    description: 'No recently deleted messages found in this channel.',
                    color: '#FF4444'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🔍 Message Recovered',
                description: snipe.content || '*No text content*',
                fields: [
                    { name: 'Author', value: snipe.author, inline: true },
                    { name: 'Deleted', value: `<t:${Math.floor(snipe.timestamp / 1000)}:R>`, inline: true }
                ]
            })]
        });
    },
};
