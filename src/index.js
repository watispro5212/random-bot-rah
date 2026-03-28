const { ShardingManager } = require('discord.js');
const path = require('path');
require('dotenv').config();

if (!process.env.TOKEN) {
    console.error('[FATAL] TOKEN is not set in the environment. Add it to your .env file.');
    process.exit(1);
}

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.TOKEN,
    totalShards: 'auto', // Or a specific number like 2 for manual testing
});

manager.on('shardCreate', shard => {
    console.log(`[SHARD] Launched shard ${shard.id}`);
});

const { initWebServer } = require('./web/server');

manager.spawn().then(() => {
    initWebServer(manager);
}).catch(err => {
    console.error('[SHARD] Failed to spawn shards:', err);
});
