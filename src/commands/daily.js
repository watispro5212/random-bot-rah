const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const DAILY_REWARD = 1000;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Receive your daily Nexus Credit allocation.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        const now = Date.now();
        const last = data.lastDaily || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const remaining = COOLDOWN_MS - diff;
            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ Allocation Pending',
                    description: `Your daily Nexus allocation has already been dispersed.\nNext drop available in **${hours}h ${minutes}m**.`,
                    color: '#FF4B2B'
                })],
                flags: 64 
            });
        }

        // Apply reward
        data.wallet += DAILY_REWARD;
        data.lastDaily = now;
        data.dailyStreak = (data.dailyStreak || 0) + 1;
        
        // Streak logic (reset if they waited longer than 48 hours)
        if (diff > COOLDOWN_MS * 2) {
            data.dailyStreak = 1;
        }

        await data.save();

        const embed = createEmbed({
            title: '🎁 Allocation Confirmed',
            description: `You received **${DAILY_REWARD.toLocaleString()} Credits** from the Nexus.\nCurrent Local Wallet: **${data.wallet.toLocaleString()} Credits**.`,
            fields: [
                { name: '🔥 System Streak', value: `${data.dailyStreak} consecutive cycle(s)`, inline: true }
            ],
            color: '#00FFCC'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
