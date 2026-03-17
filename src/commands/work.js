const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
const MIN_PAY = 150;
const MAX_PAY = 400;

const JOBS = [
    'sliced into a corporate mainframe',
    'delivered encrypted data drives',
    'mined rare Nexus cryptocurrency',
    'patched a faulty AI core',
    'sold custom terminal scripts',
    'recalibrated the orbital sensors',
    'invested in black market hardware',
    'intercepted an enemy transmission'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Execute a gig to earn Nexus Credits (1 hour cooldown).'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        const now = Date.now();
        const last = data.lastWork || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const minutes = Math.ceil((COOLDOWN_MS - diff) / 60000);
            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ System Overload',
                    description: `Your neural link needs to cool down. Rest for **${minutes} more minutes** before accepting a new gig.`,
                    color: '#FF4B2B'
                })],
                flags: 64 
            });
        }

        const payout = Math.floor(Math.random() * (MAX_PAY - MIN_PAY + 1)) + MIN_PAY;
        const jobDesc = JOBS[Math.floor(Math.random() * JOBS.length)];

        data.wallet += payout;
        data.lastWork = now;
        await data.save();

        const embed = createEmbed({
            title: '💼 Gig Complete',
            description: `You ${jobDesc} and were compensated **${payout} Credits**.\nCurrent Local Wallet: **${data.wallet.toLocaleString()} Credits**.`,
            color: '#00FFCC'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
