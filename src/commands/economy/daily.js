const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily credit allocation with streak bonuses.'),
    cooldown: 5,
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        const now = new Date();
        const cooldown = 24 * 60 * 60 * 1000;

        if (userData.lastDaily && (now - userData.lastDaily < cooldown)) {
            const timeLeft = cooldown - (now - userData.lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);

            return interaction.reply({
                embeds: [embedBuilder({
                    title: '⏳ Already Claimed',
                    description: `Your daily is on cooldown.\n**Next Claim:** \`${hours}h ${minutes}m\``,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        
        const streakWindow = 48 * 60 * 60 * 1000;
        if (userData.lastDaily && (now - userData.lastDaily < streakWindow)) {
            userData.streak = (userData.streak || 0) + 1;
        } else {
            userData.streak = 1;
        }

        
        const baseAmount = 1000;
        const streakBonus = Math.min(userData.streak * 100, 4000);
        const totalAmount = baseAmount + streakBonus;

        userData.balance += totalAmount;
        userData.totalEarned = (userData.totalEarned || 0) + totalAmount;
        userData.lastDaily = now;
        await userData.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: '✅ Daily Claimed!',
                description: [
                    `**Base Reward:** \`$${baseAmount.toLocaleString()}\``,
                    `**Streak Bonus:** \`+$${streakBonus.toLocaleString()}\` (${userData.streak} day streak 🔥)`,
                    `**Total Received:** \`$${totalAmount.toLocaleString()}\``,
                    `**Balance:** \`$${userData.balance.toLocaleString()}\``
                ].join('\n'),
                color: '#2ECC71'
            })]
        });
    },
};
