const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    welcomeChannel: { type: String, default: null },
    logChannel: { type: String, default: null },
    autoRole: { type: String, default: null },
    levelingEnabled: { type: Boolean, default: false },
    suggestionsChannel: { type: String, default: null },
    starboardChannel: { type: String, default: null },
    starboardThreshold: { type: Number, default: 5 },
    automod: {
        antiSpam: { type: Boolean, default: false },
        antiLink: { type: Boolean, default: false },
        wordFilter: { type: Boolean, default: false },
        blacklistedWords: { type: [String], default: [] }
    },
    updatedAt: { type: Date, default: Date.now }
});



guildConfigSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
