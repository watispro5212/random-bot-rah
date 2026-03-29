const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB — tuned for Atlas / replica sets
const MONGO_OPTS = {
    serverSelectionTimeoutMS: 12_000,
    maxPoolSize: 10,
};

if (process.env.MONGODB_URI) {
    mongoose
        .connect(process.env.MONGODB_URI, MONGO_OPTS)
        .then(() => console.log('[DATABASE] Connected to MongoDB.'))
        .catch((err) => console.error('[DATABASE] Connection error:', err));
} else {
    console.warn('[DATABASE] MONGODB_URI is not set. Economy, guild config, and persistence commands will fail until it is configured.');
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.blacklist = new Set();

// load commands dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// load events dynamically
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// global error handlers
process.on('unhandledRejection', (error) => {
    console.error('[Unhandled Rejection]', error);
});

process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
});

client.login(process.env.TOKEN);
