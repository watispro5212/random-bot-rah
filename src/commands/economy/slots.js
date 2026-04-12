const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

const REELS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'];

const PAYOUTS = {
    '7️⃣7️⃣7️⃣': 10,
    '💎💎💎': 7,
    '⭐⭐⭐': 5,
    '🍇🍇🍇': 4,
    '🍊🍊🍊': 3,
    '🍋🍋🍋': 2.5,
    '🍒🍒🍒': 2,
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Spin the slot machine and try your luck!')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('The amount of credits to bet.')
                .setRequired(true)
                .setMinValue(50)),
    cooldown: 8,
    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        if (userData.balance < bet) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Insufficient Funds',
                    description: `You only have \`$${userData.balance.toLocaleString()}\` in your wallet.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        // Spin the reels
        const spin = () => REELS[Math.floor(Math.random() * REELS.length)];
        const r1 = spin(), r2 = spin(), r3 = spin();
        const result = `${r1}${r2}${r3}`;

        // Build the slot machine display
        // Show surrounding rows for visual effect
        const topRow = `${spin()} ${spin()} ${spin()}`;
        const midRow = `${r1} ${r2} ${r3}`;
        const botRow = `${spin()} ${spin()} ${spin()}`;

        const slotDisplay = [
            '┌─────────────┐',
            `│  ${topRow}  │`,
            `▸  ${midRow}  ◂ ←`,
            `│  ${botRow}  │`,
            '└─────────────┘'
        ].join('\n');

        // Calculate winnings
        let multiplier = 0;
        let jackpot = false;

        if (PAYOUTS[result]) {
            multiplier = PAYOUTS[result];
            if (result === '7️⃣7️⃣7️⃣') jackpot = true;
        } else if (r1 === r2 || r2 === r3) {
            multiplier = 1.5; // 2 matching = small win
        }

        const winnings = Math.floor(bet * multiplier);
        const netGain = winnings - bet;

        userData.balance += netGain;
        if (netGain > 0) userData.totalEarned = (userData.totalEarned || 0) + netGain;
        await userData.save();

        let statusText, color;

        if (jackpot) {
            statusText = `🎰 **JACKPOT!!** 🎰\nYou won \`$${winnings.toLocaleString()}\` (${multiplier}x)!`;
            color = '#FFD700';
        } else if (multiplier >= 2) {
            statusText = `🎉 **Big Win!** +\`$${netGain.toLocaleString()}\` (${multiplier}x)`;
            color = '#2ECC71';
        } else if (multiplier > 0) {
            statusText = `✨ **Small Win!** +\`$${netGain.toLocaleString()}\` (${multiplier}x)`;
            color = '#F1C40F';
        } else {
            statusText = `💀 **No match!** -\`$${bet.toLocaleString()}\``;
            color = '#ED4245';
        }

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🎰 Slot Machine',
                description: [
                    '```',
                    slotDisplay,
                    '```',
                    '',
                    statusText,
                    `**Balance:** \`$${userData.balance.toLocaleString()}\``
                ].join('\n'),
                color,
                footer: `Nexus v12.0.0 • Bet: $${bet.toLocaleString()}`
            })]
        });
    },
};
