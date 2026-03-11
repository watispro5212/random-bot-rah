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

const { verifyKey, InteractionType, InteractionResponseType } = require('discord-interactions');

// Preserve raw body for signature verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

/**
 * Discord requires cryptographic signature verification for Webhook URLs.
 */
app.post('/webhook', (req, res) => {
    fs.appendFileSync('webhook_hits.log', `[DEBUG] Request received at ${new Date().toISOString()}\nHeaders: ${JSON.stringify(req.headers, null, 2)}\nBody: ${JSON.stringify(req.body, null, 2)}\n\n`);
    console.log('[DEBUG] Webhook endpoint hit! Headers:', JSON.stringify(req.headers, null, 2));
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    const rawBody = req.rawBody;

    if (!rawBody) {
        console.error('[WEBHOOK] No raw body found! Check body parser configuration.');
    }

    // Verify the signature
    const isValidRequest = verifyKey(rawBody || '', signature, timestamp, process.env.PUBLIC_KEY);

    if (!isValidRequest) {
        console.error('[WEBHOOK] Signature verification failed!');
        return res.status(401).send('Invalid signature');
    }

    const { type } = req.body;
    console.log('[WEBHOOK] Verified request received. Type:', type);

    // 1. Event Webhook verification (PING Type 0)
    // Discord documentation says respond with 204 No Content
    if (type === 0 || type === '0') {
        console.log('[WEBHOOK] Responding to Event PING (type 0) with 204');
        return res.status(204).send();
    }

    // 2. Interactions Endpoint verification (PING Type 1)
    // Expected response is { type: 1 }
    if (type === InteractionType.PING) {
        console.log('[WEBHOOK] Responding to Interaction PING (type 1) with type 1');
        return res.send({
            type: InteractionResponseType.PONG,
        });
    }

    // Default response for other interactions
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
