const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();

// Load Commands dynamically
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

// Load Events dynamically
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

// Global Error Handlers
process.on('unhandledRejection', (error) => {
    console.error('[Unhandled Rejection]', error);
    fs.appendFileSync('error.log', `[Unhandled Rejection] ${new Date().toISOString()}\n${error.stack || error}\n\n`);
});

process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
    fs.appendFileSync('error.log', `[Uncaught Exception] ${new Date().toISOString()}\n${error.stack || error}\n\n`);
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const { verifyKeyMiddleware, InteractionType, InteractionResponseType } = require('discord-interactions');

/**
 * Discord requires cryptographic signature verification for Webhook URLs.
 * The verifyKeyMiddleware automatically checks the X-Signature-Ed25519 and X-Signature-Timestamp headers.
 */
app.post('/webhook', verifyKeyMiddleware(process.env.PUBLIC_KEY), (req, res) => {
    const { type, data } = req.body;

    console.log('[WEBHOOK] Verified request received. Type:', type);

    // Discord Event Webhook verification (PING)
    if (type === InteractionType.PING) {
        console.log('[WEBHOOK] Responding to PING with type 1');
        return res.send({
            type: InteractionResponseType.PONG,
        });
    }

    // Handle other event types if needed
    // ...

    return res.send({ type: InteractionResponseType.PONG });
});

app.get('/', (req, res) => {
    res.send('NexusBot Backend is running!');
});

const ngrok = require('@ngrok/ngrok');

app.listen(port, async () => {
    console.log(`[SERVER] Web server listening at http://localhost:${port}`);
    
    if (process.env.NGROK_AUTHTOKEN) {
        try {
            const session = await new ngrok.SessionBuilder()
                .authtoken(process.env.NGROK_AUTHTOKEN)
                .connect();
            const tunnel = await session.httpEndpoint()
                .listen();
            
            console.log(`[NGROK] Tunnel established! Public URL: ${tunnel.url()}`);
            console.log(`[NGROK] Use this URL in Discord: ${tunnel.url()}/webhook`);
            fs.writeFileSync('ngrok_url.txt', tunnel.url());
        } catch (err) {
            console.error('[NGROK] Failed to establish tunnel:', err.message);
        }
    } else {
        console.log('[NGROK] No NGROK_AUTHTOKEN found in .env. Skipping automated tunnel.');
    }
});

client.login(process.env.TOKEN);
