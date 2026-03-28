const User = require('../models/User');

class EconomyManager {
    /**
     * Get a user from the database or create a new one if they don't exist.
     * @param {string} userId 
     * @param {string} guildId 
     */
    async getUser(userId, guildId) {
        try {
            let user = await User.findOne({ userId, guildId });
            
            if (!user) {
                user = await User.create({
                    userId,
                    guildId,
                    wallet: 0,
                    bank: 0,
                    bankCapacity: 5000,
                    xp: 0,
                    level: 1,
                    inventory: []
                });
            }

            return user;
        } catch (error) {
            console.error('[EconomyManager] Error in getUser:', error);
            return null;
        }
    }

    /**
     * Save user data to the database.
     * Note: Since User is a Mongoose document, you can also call user.save() directly.
     * This method is kept for compatibility with existing command structure.
     */
    async saveUser(user) {
        try {
            await user.save();
        } catch (error) {
            console.error('[EconomyManager] Error in saveUser:', error);
        }
    }

    /**
     * Adjust wallet balance by delta (can be negative). Clamps wallet at 0.
     */
    async addBalance(userId, guildId, delta) {
        const user = await this.getUser(userId, guildId);
        if (!user) return null;
        user.wallet += delta;
        if (user.wallet < 0) user.wallet = 0;
        await user.save();
        return user;
    }

    /**
     * Get the top 10 users by net worth in a specific guild.
     * @param {string} guildId 
     */
    async getLeaderboard(guildId) {
        try {
            const users = await User.find({ guildId })
                .sort({ wallet: -1, bank: -1 })
                .limit(10);

            return users.map(user => ({
                id: user.userId,
                net: user.wallet + user.bank
            }));
        } catch (error) {
            console.error('[EconomyManager] Error in getLeaderboard:', error);
            return [];
        }
    }
}

module.exports = new EconomyManager();
