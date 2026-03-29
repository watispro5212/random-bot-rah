const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const packageJson = require('../../package.json');

function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0 || d > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${sec}s`);
    return parts.join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Show process uptime, client session, and gateway ping.'),
    async execute(interaction) {
        const client = interaction.client;
        const procUptime = formatDuration(process.uptime() * 1000);
        const clientUptime = client.uptime != null ? formatDuration(client.uptime) : '—';
        const ping = client.ws?.ping != null ? `${client.ws.ping}ms` : '—';

        let shardInfo = 'single process';
        if (client.shard) {
            const ids = client.shard.ids;
            const count = client.shard.count;
            shardInfo = `${Array.isArray(ids) ? ids.join(', ') : ids} / ${count ?? '?'} shards`;
        }

        const embed = createEmbed({
            title: 'Uptime & session',
            color: '#00FFCC',
            fields: [
                { name: 'Process', value: `\`${procUptime}\``, inline: true },
                { name: 'Discord client', value: `\`${clientUptime}\``, inline: true },
                { name: 'Gateway ping', value: `\`${ping}\``, inline: true },
                { name: 'Sharding', value: `\`${shardInfo}\``, inline: true },
                { name: 'Build', value: `\`v${packageJson.version}\``, inline: true },
                { name: 'Commands', value: `\`${client.commands.size}\``, inline: true },
            ],
        });

        await interaction.reply({ embeds: [embed], flags: 64 });
    },
};
