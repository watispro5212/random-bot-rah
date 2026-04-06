const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.commands = new Collection();
client.events = new Collection();

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        logger.success('Connected to MongoDB.');
    }).catch(err => {
        logger.error('Failed to connect to MongoDB:', err);
    });
} else {
    logger.warn('MONGODB_URI not found. Persistence might not work.');
}

// Load Handlers
const handlersPath = path.join(__dirname, 'handlers');
fs.readdirSync(handlersPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(handlersPath, file))(client);
    }
});

client.login(process.env.TOKEN).catch(err => {
    logger.error('Failed to login to Discord:', err);
});

// Error handling
process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    logger.error('Uncaught exception:', error);
});
