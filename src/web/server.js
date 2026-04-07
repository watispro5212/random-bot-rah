const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('../utils/logger');
require('dotenv').config();

/**
 * NEXUS PROTOCOL v7.0.0 — COMPANION WEB SERVER
 * Provides static hosting for dashboard and API endpoints for metadata/stats.
 */
module.exports = (manager) => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Security: Restrict access to internal files
    const blockList = [
        'src',
        'node_modules',
        'scripts',
        '.env',
        '.git',
        'package.json',
        'package-lock.json',
        '.gitignore',
        '.github'
    ];

    app.use(cors());

    // Custom middleware to block sensitive paths
    app.use((req, res, next) => {
        const segments = req.path.split('/').filter(Boolean);
        if (segments.some(seg => blockList.includes(seg) || seg.startsWith('.'))) {
            logger.warn(`[WEB] Blocked attempt to access: ${req.path} from ${req.ip}`);
            return res.status(403).send('Forbidden: Access to system files is restricted.');
        }
        next();
    });

    // API: Health Check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'online', version: '7.0.0', uptime: process.uptime() });
    });

    // API: Version
    app.get('/api/version', (req, res) => {
        res.json({
            name: 'Nexus Protocol',
            version: '7.0.0',
            author: 'watispro5212, watispro1',
            build: 'stable'
        });
    });

    // API: Network Stats
    app.get('/api/stats', async (req, res) => {
        try {
            const results = await manager.broadcastEval(c => ({
                guilds: c.guilds.cache.size,
                members: c.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0),
                ping: c.ws.ping
            }));

            const aggregated = results.reduce((acc, cur) => ({
                guilds: acc.guilds + cur.guilds,
                members: acc.members + cur.members,
                avgPing: acc.avgPing + (cur.ping / results.length)
            }), { guilds: 0, members: 0, avgPing: 0 });

            res.json({
                ...aggregated,
                shards: results.length,
                timestamp: Date.now()
            });
        } catch (err) {
            logger.error('[WEB] Failed to fetch stats:', err);
            res.status(500).json({ error: 'Failed to broadcast query to shards.' });
        }
    });

    // Serve static files from root
    app.use(express.static(path.join(__dirname, '../../'), {
        dotfiles: 'deny',
        index: 'index.html'
    }));

    // Fallback for SPA-like behavior or clean URLs
    app.get('*', (req, res, next) => {
        if (!req.path.includes('.')) {
            const possibleFile = path.join(__dirname, '../../', `${req.path}.html`);
            return res.sendFile(possibleFile, err => {
                if (err) next();
            });
        }
        next();
    });

    app.listen(PORT, () => {
        logger.success(`[WEB] Companion Server live on port ${PORT}`);
    });
};
