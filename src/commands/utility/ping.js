const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and connection quality.'),
    cooldown: 5,
    async execute(interaction, client) {
        const sent = await interaction.reply({
            content: '`[HANDSHAKE]` Pinging gateway...',
            fetchReply: true,
            flags: [MessageFlags.Ephemeral]
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        
        const getQuality = (ms) => {
            if (ms < 50) return { label: 'Excellent', color: '#2ECC71', bar: '█████' };
            if (ms < 100) return { label: 'Good', color: '#3498DB', bar: '████░' };
            if (ms < 200) return { label: 'Fair', color: '#F1C40F', bar: '███░░' };
            if (ms < 400) return { label: 'Poor', color: '#E67E22', bar: '██░░░' };
            return { label: 'Critical', color: '#ED4245', bar: '█░░░░' };
        };

        const botQ = getQuality(latency);
        const apiQ = getQuality(apiLatency);

        await interaction.editReply({
            content: null,
            embeds: [embedBuilder({
                title: '🏓 Pong! — Latency Report',
                fields: [
                    { name: 'Bot Latency', value: `\`${latency}ms\` ${botQ.bar} ${botQ.label}`, inline: true },
                    { name: 'API Latency', value: `\`${apiLatency}ms\` ${apiQ.bar} ${apiQ.label}`, inline: true },
                    { name: 'Shard', value: `\`#${client.shard?.ids[0] ?? 0}\``, inline: true }
                ],
                color: botQ.color
            })]
        });
    },
};
