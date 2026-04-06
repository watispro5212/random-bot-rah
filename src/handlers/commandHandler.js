const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    
    // Create directoy if it doesn't exist
    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

    const loadCommands = (dir) => {
        const files = fs.readdirSync(path.join(commandsPath, dir));
        
        for (const file of files) {
            const stat = fs.lstatSync(path.join(commandsPath, dir, file));
            
            if (stat.isDirectory()) {
                loadCommands(path.join(dir, file));
            } else if (file.endsWith('.js')) {
                const command = require(path.join(commandsPath, dir, file));
                
                if (command.data && command.execute) {
                    client.commands.set(command.data.name, command);
                } else {
                    logger.warn(`Command at ${path.join(dir, file)} is missing required "data" or "execute" property.`);
                }
            }
        }
    };

    try {
        loadCommands('');
        logger.success(`Loaded ${client.commands.size} commands.`);
    } catch (err) {
        logger.error('Error loading commands:', err);
    }
};
