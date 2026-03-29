const mongoose = require('mongoose');
const { Events, ActivityType } = require('discord.js');
const logger = require('../utils/logger');
const { hydrateClientBlacklist } = require('../utils/blacklistService');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const runHydrate = () => hydrateClientBlacklist(client);
        if (mongoose.connection.readyState === 1) {
            await runHydrate();
        } else {
            mongoose.connection.once('connected', () => {
                runHydrate().catch((e) => logger.error(`[Blacklist] hydrate: ${e.message}`));
            });
        }

        logger.info(`Ready! Logged in as ${client.user.tag}`);
        logger.info(`Tracking ${client.guilds.cache.size} server(s).`);

        let i = 0;
        setInterval(() => {
            const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const serverCount = client.guilds.cache.size;
            const commandCount = client.commands.size;

            const activities = [
                { name: `${memberCount} members`, type: ActivityType.Watching },
                { name: `with ${commandCount} commands`, type: ActivityType.Playing },
                { name: `${serverCount} servers`, type: ActivityType.Watching },
                { name: "for /help", type: ActivityType.Listening },
            ];

            const activity = activities[i % activities.length];
            client.user.setPresence({
                activities: [activity],
                status: 'online',
            });
            i++;
        }, 15000);
    },
};
