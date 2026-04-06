const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot latency.'),
    async execute(interaction, client) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true,
            ephemeral: true
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        await interaction.editReply({
            content: null,
            embeds: [embedBuilder({
                title: '🏓 Pong!',
                fields: [
                    { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                    { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
                ],
                color: '#5865F2'
            })]
        });
    },
};
