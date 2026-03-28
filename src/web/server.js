const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

function initWebServer(manager) {
    app.use(cors());
    app.use(express.json());

    // Serve all static files from the root directory (where HTML files are)
    app.use(express.static(path.join(__dirname, '../../')));

    // API endpoint for live bot statistics
    app.get('/api/stats', async (req, res) => {
        try {
            // Fetch data across all shards
            const reqs = await Promise.all([
                manager.broadcastEval(c => c.guilds.cache.size),
                manager.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                manager.broadcastEval(c => c.ws.ping)
            ]);

            const totalGuilds = reqs[0].reduce((acc, shardCount) => acc + shardCount, 0);
            const totalMembers = reqs[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const shardCount = Math.max(1, manager.totalShards || reqs[2].length || 1);
            const avgPing = Math.round(reqs[2].reduce((acc, ping) => acc + ping, 0) / shardCount);

            res.json({
                guilds: totalGuilds,
                members: totalMembers,
                ping: avgPing,
                uptime: process.uptime(),
                shards: manager.totalShards
            });
        } catch (error) {
            console.error('[API Error]', error);
            res.status(500).json({ error: 'Failed to fetch network status' });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[WEB] Nexus Interface running on port ${PORT}`);
    });
}

module.exports = { initWebServer };
