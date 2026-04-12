const { SlashCommandBuilder, version: djsVersion } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('View detailed bot diagnostics and statistics.'),
    cooldown: 10,
    async execute(interaction, client) {
        const uptime = formatUptime(client.uptime);
        const memUsage = process.memoryUsage();
        const heapMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const rssMB = (memUsage.rss / 1024 / 1024).toFixed(2);

        let totalGuilds = client.guilds.cache.size;
        let totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
        let totalChannels = client.channels.cache.size;

        try {
            const shardGuilds = await client.shard?.fetchClientValues('guilds.cache.size');
            const shardMembers = await client.shard?.broadcastEval(c => c.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
            if (shardGuilds) totalGuilds = shardGuilds.reduce((a, b) => a + b, 0);
            if (shardMembers) totalMembers = shardMembers.reduce((a, b) => a + b, 0);
        } catch {}

        const embed = embedBuilder({
            title: '🤖 Nexus Bot Diagnostics',
            description: 'Comprehensive system telemetry for the Apex Core engine.',
            color: '#00F5FF',
            thumbnail: client.user.displayAvatarURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '📊 Version', value: '`v12.0.0`', inline: true },
                { name: '📡 Shard', value: `\`#${client.shard?.ids[0] ?? 0}\``, inline: true },
                { name: '⏱️ Uptime', value: `\`${uptime}\``, inline: true },
                { name: '🏢 Guilds', value: `\`${totalGuilds.toLocaleString()}\``, inline: true },
                { name: '👥 Members', value: `\`${totalMembers.toLocaleString()}\``, inline: true },
                { name: '📺 Channels', value: `\`${totalChannels.toLocaleString()}\``, inline: true },
                { name: '💾 Heap', value: `\`${heapMB} MB\``, inline: true },
                { name: '📦 RSS', value: `\`${rssMB} MB\``, inline: true },
                { name: '🏓 Latency', value: `\`${client.ws.ping}ms\``, inline: true },
                { name: '🔧 Node.js', value: `\`${process.version}\``, inline: true },
                { name: '📚 Discord.js', value: `\`v${djsVersion}\``, inline: true },
                { name: '💻 Platform', value: `\`${os.platform()} ${os.arch()}\``, inline: true },
                { name: '📋 Commands', value: `\`${client.commands.size}\``, inline: true },
                { name: '🎮 Events', value: `\`${client.events.size}\``, inline: true },
            ]
        });

        await interaction.reply({ embeds: [embed] });
    }
};

function formatUptime(ms) {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
}
