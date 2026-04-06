const chalk = require('chalk');

const logger = {
    info: (message) => {
        console.log(`[${new Date().toLocaleString()}] [INFO] ${message}`);
    },
    success: (message) => {
        console.log(`[${new Date().toLocaleString()}] [SUCCESS] ${message}`);
    },
    warn: (message) => {
        console.log(`[${new Date().toLocaleString()}] [WARN] ${message}`);
    },
    error: (message, error) => {
        console.error(`[${new Date().toLocaleString()}] [ERROR] ${message}`);
        if (error) console.error(error);
    },
    shard: (shardId, message) => {
        console.log(`[${new Date().toLocaleString()}] [SHARD ${shardId}] ${message}`);
    }
};

module.exports = logger;
