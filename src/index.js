const { ShardingManager } = require('discord.js');
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

// ═══════════════════════════════════════════════
//   NEXUS PROTOCOL v7.0.0 — SHARDING MANAGER
// ═══════════════════════════════════════════════

logger.info('═══════════════════════════════════════════════');
logger.info('  NEXUS PROTOCOL v7.0.0 — INITIALIZING...');
logger.info('═══════════════════════════════════════════════');

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    token: process.env.TOKEN,
    totalShards: 'auto',
    respawn: true,
});

manager.on('shardCreate', shard => {
    logger.success(`[SHARD ${shard.id}] Spawned.`);

    shard.on('error', err => {
        logger.error(`[SHARD ${shard.id}] Error:`, err);
    });

    shard.on('disconnect', () => {
        logger.warn(`[SHARD ${shard.id}] Disconnected — will attempt respawn.`);
    });

    shard.on('reconnecting', () => {
        logger.info(`[SHARD ${shard.id}] Reconnecting...`);
    });
});

// Launch Companion Web Server
const webServer = require('./web/server');
webServer(manager);

manager.spawn().catch(error => {
    logger.error('Failed to spawn shards:', error);
});
