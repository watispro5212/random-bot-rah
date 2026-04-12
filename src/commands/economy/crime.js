const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

const crimes = [
    { name: 'Hacked a corporate database', emoji: '💻', minReward: 500, maxReward: 3000 },
    { name: 'Smuggled encrypted data packets', emoji: '📦', minReward: 800, maxReward: 4000 },
    { name: 'Sold classified intelligence', emoji: '🕵️', minReward: 1000, maxReward: 5000 },
    { name: 'Laundered digital currency', emoji: '🏦', minReward: 600, maxReward: 3500 },
    { name: 'Deployed a ransomware attack', emoji: '🔒', minReward: 1500, maxReward: 6000 },
    { name: 'Ran an underground auction', emoji: '🎭', minReward: 700, maxReward: 4500 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crime')
        .setDescription('Commit a high-risk crime for big rewards — but beware the consequences.'),
    cooldown: 5,
    async execute(interaction, client) {
        let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!userData) {
            userData = new User({ userId: interaction.user.id, guildId: interaction.guild.id });
        }

        
        const cooldown = 2 * 60 * 60 * 1000;
        if (userData.lastCrime && (Date.now() - userData.lastCrime < cooldown)) {
            const timeLeft = cooldown - (Date.now() - userData.lastCrime);
            const mins = Math.floor(timeLeft / 60000);
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '⏳ Heat Level Too High',
                    description: `Authorities are on alert. Lay low for \`${mins}m\`.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        const success = Math.random() < 0.4; 

        userData.lastCrime = new Date();

        if (success) {
            const reward = Math.floor(Math.random() * (crime.maxReward - crime.minReward + 1)) + crime.minReward;
            userData.balance += reward;
            userData.totalEarned = (userData.totalEarned || 0) + reward;
            await userData.save();

            await interaction.reply({
                embeds: [embedBuilder({
                    title: `${crime.emoji} Crime Successful!`,
                    description: `**Operation:** ${crime.name}\n**Payout:** \`$${reward.toLocaleString()}\`\n**Balance:** \`$${userData.balance.toLocaleString()}\``,
                    color: '#2ECC71'
                })]
            });
        } else {
            const fine = Math.floor(Math.random() * 2000) + 500;
            userData.balance = Math.max(0, userData.balance - fine);
            await userData.save();

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🚨 Busted!',
                    description: `**Operation:** ${crime.name}\n**Status:** FAILED — Caught by authorities\n**Fine:** \`$${fine.toLocaleString()}\`\n**Balance:** \`$${userData.balance.toLocaleString()}\``,
                    color: '#ED4245'
                })]
            });
        }
    },
};
