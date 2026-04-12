const { Events, ActivityType } = require('discord.js');
const logger = require('../../utils/logger');

const statuses = [
    { name: 'the Apex Core | v12.0.0', type: ActivityType.Watching },
    { name: '{guilds} operational nodes', type: ActivityType.Watching },
    { name: 'with {members} operatives', type: ActivityType.Playing },
    { name: 'Neural Uplink Status: Apex', type: ActivityType.Listening },
    { name: 'Shard {shard} • {ping}ms', type: ActivityType.Competing },
    { name: '/help | 73 Protocols', type: ActivityType.Listening },
];

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const ascii = [
            '',
            '  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗',
            '  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝',
            '  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗',
            '  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║',
            '  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║',
            '  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
            '  ─────────── PROTOCOL v12.0.0 // APEX ───────────',
            '',
        ];
        ascii.forEach(line => console.log(`\x1b[36m${line}\x1b[0m`));

        logger.success(`Ready! Logged in as ${client.user.tag}`);
        logger.info(`Serving ${client.guilds.cache.size} guilds on shard ${client.shard?.ids[0] ?? 0}`);
        logger.info(`Loaded ${client.commands.size} commands across all categories`);

        const updatePresence = () => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const name = status.name
                .replace('{guilds}', client.guilds.cache.size)
                .replace('{members}', client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0))
                .replace('{shard}', client.shard?.ids[0] ?? 0)
                .replace('{ping}', client.ws.ping);

            client.user.setPresence({
                activities: [{ name, type: status.type }],
                status: 'online',
            });
        };

        updatePresence();
        setInterval(updatePresence, 30000);
    },
};
