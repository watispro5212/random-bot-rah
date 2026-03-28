const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { replyWithMessage } = require('../utils/replyMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Measure the latency between the physical world and the Nexus.'),
    async execute(interaction) {
        const sent = await replyWithMessage(interaction, {
            embeds: [
                createEmbed({
                    title: '🛰️ Calibrating Neural Link...',
                    description: '`[CONNECTING]` established... Tapping into the global data bus.',
                    color: '#FFCC00',
                }),
            ],
        });

        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = Math.round(interaction.client.ws.ping);

        let color = '#00FFCC'; 
        let status = 'OPTIMAL. NO PACKET LOSS DETECTED.';
        let icon = '🟢';

        if (roundtripLatency > 400 || wsLatency > 200) {
            color = '#FFCC00'; 
            status = 'TURBULENT. MINOR SIGNAL INTERFERENCE.';
            icon = '🟡';
        }
        if (roundtripLatency > 1000 || wsLatency > 500) {
            color = '#FF4B2B'; 
            status = 'CRITICAL. DROPPING PACKETS. SYSTEM UNSTABLE.';
            icon = '🔴';
        }

        const embed = createEmbed({
            title: '✨ Data Pulse Return',
            color: color,
            fields: [
                { name: '📡 Gateway Latency', value: `\`${wsLatency}ms\``, inline: true },
                { name: '🛰️ Roundtrip Trip', value: `\`${roundtripLatency}ms\``, inline: true },
                { name: '🧬 Connection Health', value: `${icon} ${status}`, inline: false }
            ],
            footer: 'Nexus Protocol v3.0 | Signal Strength: Max'
        });

        setTimeout(async () => {
            await interaction.editReply({ embeds: [embed] });
        }, 1500);
    },
};
