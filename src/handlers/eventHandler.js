const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath);

    const loadEvents = (dir) => {
        const files = fs.readdirSync(path.join(eventsPath, dir));
        
        for (const file of files) {
            const stat = fs.lstatSync(path.join(eventsPath, dir, file));
            
            if (stat.isDirectory()) {
                loadEvents(path.join(dir, file));
            } else if (file.endsWith('.js')) {
                const event = require(path.join(eventsPath, dir, file));
                
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                
                client.events.set(event.name, event);
            }
        }
    };

    try {
        loadEvents('');
        logger.success(`Loaded ${client.events.size} events.`);
    } catch (err) {
        logger.error('Error loading events:', err);
    }
};
