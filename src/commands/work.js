const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const COOLDOWN_MS = 60 * 60 * 1000; 
const MIN_PAY = 150;
const MAX_PAY = 450;

const JOBS = [
    'sliced into a corporate mainframe',
    'delivered encrypted data drives to Sector 7',
    'mined rare Nexus cryptocurrency kernels',
    'patched a corrupted AI neural core',
    'sold custom terminal scripts on the black market',
    'recalibrated high-density orbital sensors',
    'intercepted a rogue enemy transmission',
    'debugged a planetary defense sub-grid'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Accepts a freelance gig in the Nexus for credits.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        const now = Date.now();
        const last = data.lastWork || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const nextGig = new Date(last + COOLDOWN_MS);
            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ Neural Cooldown Critical',
                    description: `\`[SYSTEM]\` Overheat detected. Rest until <t:${Math.floor(nextGig.getTime() / 1000)}:R> before your next gig.`,
                    color: '#FF4B2B'
                })],
                flags: 64 
            });
        }

        await interaction.reply({
            embeds: [createEmbed({
                title: '💼 Initializing Freelance Gig...',
                description: '`[LOADING]` mission parameters... Connecting to the underworld signal.',
                color: '#FFCC00'
            })]
        });

        const payout = Math.floor(Math.random() * (MAX_PAY - MIN_PAY + 1)) + MIN_PAY;
        const jobDesc = JOBS[Math.floor(Math.random() * JOBS.length)];

        data.wallet += payout;
        data.lastWork = now;
        await data.save();

        const embed = createEmbed({
            title: '💰 Gig Execution: SUCCESS',
            description: `You **${jobDesc}** and were compensated \`${payout}\` **CR**.\nCurrent Liquid Balance: \`${data.wallet.toLocaleString()}\` **CR**.`,
            color: '#00FFCC',
            footer: 'Nexus Freelance Bureau | Payment Processed'
        });

        setTimeout(async () => {
            await interaction.editReply({ embeds: [embed] });
        }, 1800);
    },
};
