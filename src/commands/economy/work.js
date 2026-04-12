const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

const jobs = [
    { title: 'Decrypted classified intel', emoji: '🔐' },
    { title: 'Patched a firewall breach', emoji: '🛡️' },
    { title: 'Deployed a surveillance drone', emoji: '🛸' },
    { title: 'Completed a data extraction', emoji: '💾' },
    { title: 'Infiltrated a rival network', emoji: '🕵️' },
    { title: 'Resolved a server outage', emoji: '⚡' },
    { title: 'Conducted a system audit', emoji: '📋' },
    { title: 'Established a secure uplink', emoji: '📡' },
    { title: 'Reverse-engineered malware', emoji: '🧬' },
    { title: 'Trained neural network agents', emoji: '🤖' },
    { title: 'Hacked into the mainframe', emoji: '💻' },
    { title: 'Executed a zero-day exploit', emoji: '🎯' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Execute a gig to earn Nexus Credits.'),
    cooldown: 5,
    async execute(interaction, client) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        const now = new Date();
        const cooldown = 60 * 60 * 1000; 

        if (userData.lastWork && (now - userData.lastWork < cooldown)) {
            const timeLeft = cooldown - (now - userData.lastWork);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            return interaction.reply({
                embeds: [embedBuilder({
                    title: '⏳ Rest Required',
                    description: `Your terminal is cooling down.\n**Available in:** \`${minutes}m ${seconds}s\``,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const minWork = 200;
        const maxWork = 800;
        const levelBonus = (userData.level || 1) * 20;
        const amount = Math.floor(Math.random() * (maxWork - minWork + 1)) + minWork + levelBonus;

        userData.balance += amount;
        userData.totalEarned = (userData.totalEarned || 0) + amount;
        userData.lastWork = now;
        await userData.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: `${job.emoji} Gig Complete!`,
                description: `**Task:** ${job.title}\n**Credits Earned:** \`$${amount.toLocaleString()}\` (includes \`+$${levelBonus}\` level bonus)\n**Balance:** \`$${userData.balance.toLocaleString()}\``,
                color: '#2ECC71'
            })]
        });
    },
};
