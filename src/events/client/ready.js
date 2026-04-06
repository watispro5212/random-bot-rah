const { Events, ActivityType } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.success(`Ready! Logged in as ${client.user.tag}`);
        
        client.user.setPresence({
            activities: [{ 
                name: 'Nexus Protocol | /help', 
                type: ActivityType.Watching 
            }],
            status: 'online',
        });
    },
};
