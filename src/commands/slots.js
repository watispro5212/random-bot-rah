const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const MIN_BET = 50;
const MAX_BET = 50000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Bet your credits on the slot machine! Match 3 to win big.')
        .addIntegerOption(opt => 
            opt.setName('bet')
                .setDescription('The amount of credits to bet (Min 50, Max 50k)')
                .setRequired(true)
                .setMinValue(MIN_BET)
                .setMaxValue(MAX_BET)
        ),
    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');
        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        if (data.wallet < bet) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Funds',
                    description: `You are trying to bet **${bet.toLocaleString()} Credits**, but your wallet only has **${data.wallet.toLocaleString()} Credits**.`,
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        await interaction.reply({
            embeds: [createEmbed({
                title: '🎰 Spinning Reels...',
                description: '`[ SPINNING ]` \n\n🎰 | 🎰 | 🎰',
                color: '#FFCC00'
            })]
        });

        // Small delay to build suspense with "animation" frames
        const frames = [
            `[ 🍒 | 💎 | 🎰 ]`,
            `[ 🔔 | 🍋 | 🍉 ]`,
            `[ 💎 | 🎰 | 🍒 ]`
        ];

        for (const frame of frames) {
            await new Promise(resolve => setTimeout(resolve, 600));
            await interaction.editReply({
                embeds: [createEmbed({
                    title: '🎰 Spinning Reels...',
                    description: `\`[ SPINNING ]\` \n\n${frame}`,
                    color: '#FFCC00'
                })]
            });
        }

        const icons = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '🎰'];
        const results = [];
        
        for (let i = 0; i < 3; i++) {
            let pick = Math.floor(Math.random() * icons.length);
            if (hasCharm && Math.random() < 0.20 && pick > 0) pick -= 1;
            results.push(icons[pick]);
        }

        let multiplier = 0;
        let winMessage = 'BET LOST. THE HOUSE WINS.';
        let color = '#FF4B2B';

        const isThreeOfAKind = results[0] === results[1] && results[1] === results[2];
        const isTwoOfAKind = results[0] === results[1] || results[1] === results[2] || results[0] === results[2];

        if (isThreeOfAKind) {
            if (results[0] === '🎰') {
                multiplier = 50; 
                winMessage = '🚨 **SYSTEM JACKPOT!!!** 🚨\n*Direct Hit on 3 🎰 Core!*';
                color = '#F1C40F';
            } else if (results[0] === '💎') {
                multiplier = 10;
                winMessage = '💎 **ELITE YIELD!** 💎\n*3 💎 extracted!*';
                color = '#00FFCC';
            } else {
                multiplier = 5;
                winMessage = '✨ **DATA MATCH!** ✨\n*Triple sequence detected!*';
                color = '#00FFCC';
            }
        } else if (isTwoOfAKind) {
            multiplier = 2;
            winMessage = '📈 **MINOR GAIN.** \n*Partial match detected.*';
            color = '#FFCC00';
        }

        const winnings = Math.floor(bet * multiplier);
        if (winnings > 0) {
            data.wallet += winnings;
            economy.saveUser(userId, data);
        }

        const embed = createEmbed({
            title: '🎰 Nexus Slot Terminal',
            description: `\`[ ${results.join(' | ')} ]\`\n\n${winMessage}`,
            fields: [
                { name: '📥 Wager', value: `\`${bet.toLocaleString()}\` **CR**`, inline: true },
                { name: '📤 Payout', value: `**${winnings.toLocaleString()}** **CR**`, inline: true },
                { name: '💳 New Balance', value: `\`${data.wallet.toLocaleString()}\` **CR**`, inline: true }
            ],
            color: color,
            footer: 'Nexus Casino v4.2 | Odds: Algorithmic'
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
