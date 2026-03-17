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

        await interaction.deferReply();

        // Check for Lucky Charm bonus in inventory
        const hasCharm = data.inventory && data.inventory.includes('lucky_charm');

        // Deduct bet and save to prevent backing out
        data.wallet -= bet;
        await data.save();

        // Define slot icons and weights
        const icons = ['🍒', '🍋', '🍉', '🍇', '🔔', '💎', '🎰'];
        const results = [];
        
        for (let i = 0; i < 3; i++) {
            // Apply a slight weight buffer if they have a lucky charm, to push towards lower index (more common pairs)
            let pick = Math.floor(Math.random() * icons.length);
            if (hasCharm && Math.random() < 0.20 && pick > 0) pick -= 1;
            results.push(icons[pick]);
        }

        let multiplier = 0;
        let winMessage = 'Better luck next time!';
        let color = '#FF4B2B';

        const isThreeOfAKind = results[0] === results[1] && results[1] === results[2];
        const isTwoOfAKind = results[0] === results[1] || results[1] === results[2] || results[0] === results[2];

        if (isThreeOfAKind) {
            if (results[0] === '🎰') {
                multiplier = 50; // JACKPOT
                winMessage = '🚨 **JACKPOT!!!** 🚨\n*You matched 3 🎰!*';
                color = '#F1C40F';
            } else if (results[0] === '💎') {
                multiplier = 10;
                winMessage = '💎 **DIAMOND WIN!** 💎\n*You matched 3 💎!*';
                color = '#00FFCC';
            } else {
                multiplier = 3;
                winMessage = '**Winner!**\n*You matched 3 of a kind!*';
                color = '#00FFCC';
            }
        } else if (isTwoOfAKind) {
            multiplier = 1.5;
            winMessage = '**Small Win!**\n*You matched 2 of a kind!*';
            color = '#FFCC00';
        }

        const winnings = Math.floor(bet * multiplier);

        // Payout
        if (winnings > 0) {
            data.wallet += winnings;
            await data.save();
        }

        const slotMachineStr = `[ ${results.join(' | ')} ]`;

        const embed = createEmbed({
            title: '🎰 Slot Machine',
            description: `${slotMachineStr}\n\n${winMessage}`,
            fields: [
                { name: 'Your Bet', value: `${bet.toLocaleString()}`, inline: true },
                { name: 'Your Payout', value: `**${winnings.toLocaleString()}**`, inline: true },
                { name: 'New Wallet', value: `${data.wallet.toLocaleString()}`, inline: true }
            ],
            color: color
        });

        // Small delay to build suspense
        setTimeout(async () => {
            await interaction.editReply({ embeds: [embed] });
        }, 1500);
    },
};
