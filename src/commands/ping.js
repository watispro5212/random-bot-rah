const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the connection pulse of the Nexus.'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            embeds: [
                createEmbed({
                    title: '🛰️ Pinging...',
                    description: 'Tapping into the data streams...',
                    color: '#00FFCC'
                })
            ], 
            withResponse: true 
        });

        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = Math.round(interaction.client.ws.ping);

        let color = '#00FFCC'; // Nexus Cyan
        let status = 'Stable 🟢';

        if (roundtripLatency > 400 || wsLatency > 200) {
            color = '#FFCC00'; // Amber
            status = 'Turbulent 🟡';
        }
        if (roundtripLatency > 1000 || wsLatency > 500) {
            color = '#FF4B2B'; // Nexus Red
            status = 'Critical 🔴';
        }

        const embed = createEmbed({
            title: '📡 Signal Return',
            color: color,
            fields: [
                { name: 'Heartbeat', value: `\`${wsLatency}ms\``, inline: true },
                { name: 'Roundtrip', value: `\`${roundtripLatency}ms\``, inline: true },
                { name: 'Pulse Status', value: status, inline: false }
            ]
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
