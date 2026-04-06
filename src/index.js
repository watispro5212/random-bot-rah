const { ShardingManager } = require('discord.js');
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.TOKEN,
    totalShards: 'auto',
});

manager.on('shardCreate', shard => {
    logger.success(`[SHARD ${shard.id}] Spawned.`);
});

manager.spawn().catch(error => {
    logger.error('Failed to spawn shards:', error);
});
