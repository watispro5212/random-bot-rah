const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

// Simulating a deck of cards
const SUITS = ['♠️', '♥️', '♦️', '♣️'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    const deck = [];
    for (const suit of SUITS) {
        for (const value of VALUES) {
            deck.push({ suit, value });
        }
    }
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandValue(hand) {
    let sum = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.value === 'A') {
            aces += 1;
            sum += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            sum += 10;
        } else {
            sum += parseInt(card.value);
        }
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces -= 1;
    }
    return sum;
}

function formatHand(hand) {
    return hand.map(card => `\`${card.value}${card.suit}\``).join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of Blackjack against the dealer.')
        .addIntegerOption(opt => 
            opt.setName('bet')
                .setDescription('Amount of credits to bet')
                .setRequired(true)
                .setMinValue(10)
        ),
    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');
        const userId = interaction.user.id;
        let data = await economy.getUser(userId, interaction.guild.id);

        if (data.wallet < bet) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Funds',
                    description: `You are trying to bet **${bet.toLocaleString()} Credits**, but your wallet only has **${data.wallet.toLocaleString()}` +
                                 ` Credits**.`,
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        // Deduct upfront
        data.wallet -= bet;
        economy.saveUser(userId, data);

        const deck = createDeck();
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];

        let playerValue = calculateHandValue(playerHand);
        let dealerValue = calculateHandValue(dealerHand);

        const buildEmbed = (status, color) => {
            const embed = createEmbed({
                title: '🃏 Blackjack',
                description: `**Bet:** ${bet.toLocaleString()} Credits\n\n${status}`,
                color: color
            });
            
            // If game is still ongoing, hide dealer's second card
            const dHandStr = (status.includes('Game in progress')) 
                ? formatHand([dealerHand[0]]) + ' `? ` '
                : formatHand(dealerHand);
                
            const dValStr = (status.includes('Game in progress')) 
                ? '?'
                : dealerValue;

            embed.addFields(
                { name: `Your Hand [${playerValue}]`, value: formatHand(playerHand), inline: true },
                { name: `Dealer's Hand [${dValStr}]`, value: dHandStr, inline: true }
            );
            return embed;
        };

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bj_hit').setLabel('Hit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('bj_stand').setLabel('Stand').setStyle(ButtonStyle.Danger)
        );

        // Initial Blackjack checks
        if (playerValue === 21 && dealerValue !== 21) {
            const winnings = Math.floor(bet * 2.5); // 3:2 payout for native blackjack
            data.wallet += winnings;
            economy.saveUser(userId, data);
            return interaction.reply({ 
                embeds: [buildEmbed('**BLACKJACK!** You win!', '#00FFCC').addFields({ name: 'Payout', value: `+${winnings.toLocaleString()}` })] 
            });
        }

        const reply = await interaction.reply({ 
            embeds: [buildEmbed('Game in progress. Your turn.', '#00FFCC')], 
            components: [buttons], 
            withResponse: true 
        });

        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: 'Play your own game by typing `/blackjack`!', flags: 64 });
            }

            if (i.customId === 'bj_hit') {
                playerHand.push(deck.pop());
                playerValue = calculateHandValue(playerHand);

                if (playerValue > 21) {
                    // BUST
                    await i.update({ embeds: [buildEmbed('**BUST!** You went over 21. Dealer wins.', '#FF4B2B')], components: [] });
                    collector.stop('bust');
                } else if (playerValue === 21) {
                    // Auto-stand if 21
                    await handleDealerTurn(i);
                } else {
                    await i.update({ embeds: [buildEmbed('Game in progress. Your turn.', '#00FFCC')], components: [buttons] });
                }
            } else if (i.customId === 'bj_stand') {
                await handleDealerTurn(i);
            }
        });

        const handleDealerTurn = async (i) => {
            // Dealer must hit on < 17
            while (dealerValue < 17) {
                dealerHand.push(deck.pop());
                dealerValue = calculateHandValue(dealerHand);
            }

            let resultMsg = '';
            let color = '#FF4B2B';
            let winnings = 0;

            if (dealerValue > 21 || playerValue > dealerValue) {
                resultMsg = '**You Win!**';
                color = '#00FFCC';
                winnings = bet * 2;
            } else if (dealerValue === playerValue) {
                resultMsg = '**Push.** It\'s a tie. Bet returned.';
                color = '#FFCC00';
                winnings = bet;
            } else {
                resultMsg = '**Dealer Wins.**';
            }

            if (winnings > 0) {
                data.wallet += winnings;
                await data.save();
            }

            const finalEmbed = buildEmbed(resultMsg, color);
            if (winnings > 0) finalEmbed.addFields({ name: 'Payout', value: `+${winnings.toLocaleString()}` });

            await i.update({ embeds: [finalEmbed], components: [] });
            collector.stop('finished');
        };

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await interaction.editReply({ 
                    embeds: [buildEmbed('**Timeout!** You took too long. Dealer takes the bet.', '#A3B1C6')], 
                    components: [] 
                }).catch(() => null);
            }
        });
    },
};
