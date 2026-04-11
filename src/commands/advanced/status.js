const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Detailed system health and shard diagnostics.'),
    cooldown: 10,
    async execute(interaction, client) {
        const shardId = client.shard?.ids[0] ?? 0;
        const totalShards = client.shard?.count ?? 1;
        const heartbeat = client.ws.ping;
        const guildCount = client.guilds.cache.size;
        const memberCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

        const uptime = process.uptime();
        const hrs = Math.floor(uptime / 3600);
        const mins = Math.floor((uptime % 3600) / 60);

        const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuCores = os.cpus().length;

        const getHealthColor = (ms) => {
            if (ms < 100) return '#2ECC71';
            if (ms < 250) return '#F1C40F';
            return '#ED4245';
        };

        const getHealthStatus = (ms) => {
            if (ms < 100) return 'Stable';
            if (ms < 250) return 'Fair';
            return 'Degraded';
        };

        await interaction.reply({
            embeds: [embedBuilder({
                title: 'Nexus System Status',
                description: `**Current Load:** ${getHealthStatus(heartbeat)}\n**Shard Node:** ${shardId + 1} of ${totalShards}`,
                fields: [
                    { name: 'Servers', value: `${guildCount.toLocaleString()}`, inline: true },
                    { name: 'Users', value: `${memberCount.toLocaleString()}`, inline: true },
                    { name: 'Ping', value: `${heartbeat}ms`, inline: true },
                    { name: 'RAM Usage', value: `${memUsed} MB`, inline: true },
                    { name: 'Uptime', value: `${hrs}h ${mins}m`, inline: true },
                    { name: 'Cores', value: `${cpuCores}`, inline: true },
                    { name: 'Platform', value: `${os.platform()} ${os.arch()}`, inline: true },
                    { name: 'Node.js', value: `${process.version}`, inline: true },
                    { name: 'Commands', value: `${client.commands.size}`, inline: true },
                ],
                color: getHealthColor(heartbeat)
            })]
        });
    },
};
