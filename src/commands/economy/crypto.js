const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

// Crypto fake market values
const MARKET = {
    'NXCoin': { price: 500, volatility: 0.15 },
    'DogeBit': { price: 50, volatility: 0.40 },
    'QuantumEth': { price: 1200, volatility: 0.08 }
};

// Simple pseudo-random fluctuation based on a time seed so prices change over time
function getMarketPrice(coinId) {
    const coin = MARKET[coinId];
    if (!coin) return 0;
    
    // Create a time seed that changes every 15 minutes
    const timeSeed = Math.floor(Date.now() / (1000 * 60 * 15));
    const rawRandom = Math.abs(Math.sin(timeSeed * coinId.charCodeAt(0) * 1.5)) * 2 - 1; // Between -1 and 1
    
    // Fluctuate base price
    let currentPrice = Math.floor(coin.price + (coin.price * (rawRandom * coin.volatility)));
    return Math.max(1, currentPrice); // never drop below 1
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Trade cryptocurrency on the global Nexus market.')
        .addSubcommand(sub => 
            sub.setName('market')
            .setDescription('View the current crypto market prices.')
        )
        .addSubcommand(sub => 
            sub.setName('buy')
            .setDescription('Buy cryptocurrency.')
            .addStringOption(opt => 
                opt.setName('coin')
                .setDescription('The coin to buy')
                .setRequired(true)
                .addChoices(
                    { name: 'NXCoin 🪙', value: 'NXCoin' },
                    { name: 'DogeBit 🐕', value: 'DogeBit' },
                    { name: 'QuantumEth 💠', value: 'QuantumEth' }
                )
            )
            .addIntegerOption(opt => 
                opt.setName('amount')
                .setDescription('How many coins to buy')
                .setRequired(true)
                .setMinValue(1)
            )
        )
        .addSubcommand(sub => 
            sub.setName('sell')
            .setDescription('Sell cryptocurrency.')
            .addStringOption(opt => 
                opt.setName('coin')
                .setDescription('The coin to sell')
                .setRequired(true)
                .addChoices(
                    { name: 'NXCoin 🪙', value: 'NXCoin' },
                    { name: 'DogeBit 🐕', value: 'DogeBit' },
                    { name: 'QuantumEth 💠', value: 'QuantumEth' }
                )
            )
            .addIntegerOption(opt => 
                opt.setName('amount')
                .setDescription('How many coins to sell')
                .setRequired(true)
                .setMinValue(1)
            )
        ),
    cooldown: 5,
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        
        try {
            let userProfile = await User.findOne({ userId, guildId });
            if (!userProfile) userProfile = new User({ userId, guildId });

            // Dynamically calculate a fake portfolio object since we don't have a crypto schema
            // We will parse it from userProfile.inventory using format "CRYPTO:CoinName:Amount"
            let portfolio = {};
            userProfile.inventory.forEach(item => {
                if (item.startsWith('CRYPTO:')) {
                    const [, coin, amountStr] = item.split(':');
                    portfolio[coin] = parseInt(amountStr) || 0;
                }
            });

            // Rebuild inventory string 
            const updateInventory = () => {
                let newInv = userProfile.inventory.filter(i => !i.startsWith('CRYPTO:'));
                for (const [c, a] of Object.entries(portfolio)) {
                    if (a > 0) newInv.push(`CRYPTO:${c}:${a}`);
                }
                userProfile.inventory = newInv;
            };

            if (sub === 'market') {
                const fields = Object.keys(MARKET).map(coin => {
                    const price = getMarketPrice(coin);
                    const bal = portfolio[coin] || 0;
                    return { 
                        name: `${coin}`, 
                        value: `**Price:** $${price.toLocaleString()}\n**You own:** ${bal.toLocaleString()}`, 
                        inline: true 
                    };
                });
                
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '📈 Nexus Crypto Market',
                        description: 'Prices update dynamically every 15 minutes. Trade wisely.',
                        fields,
                        color: '#3498DB'
                    })]
                });
            }

            if (sub === 'buy') {
                const coin = interaction.options.getString('coin');
                const amount = interaction.options.getInteger('amount');
                const price = getMarketPrice(coin);
                const totalCost = price * amount;

                if (userProfile.balance < totalCost) {
                    return interaction.reply({
                        embeds: [embedBuilder({
                            title: '❌ Transaction Failed',
                            description: `You need **$${totalCost.toLocaleString()}** to buy **${amount}x ${coin}**. Your balance is only **$${userProfile.balance.toLocaleString()}**.`,
                            color: '#FF0000'
                        })],
                        flags: [MessageFlags.Ephemeral]
                    });
                }

                userProfile.balance -= totalCost;
                portfolio[coin] = (portfolio[coin] || 0) + amount;
                updateInventory();
                
                // Add XP event logic
                userProfile.xp += 10;
                await userProfile.save();

                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '✅ Purchase Successful',
                        description: `You bought **${amount.toLocaleString()}x ${coin}** for **$${totalCost.toLocaleString()}**.\n\nNew Wallet Balance: **$${userProfile.balance.toLocaleString()}**`,
                        color: '#00FF00'
                    })]
                });
            }

            if (sub === 'sell') {
                const coin = interaction.options.getString('coin');
                const amount = interaction.options.getInteger('amount');
                const price = getMarketPrice(coin);
                const totalYield = price * amount;
                const currentOwned = portfolio[coin] || 0;

                if (currentOwned < amount) {
                    return interaction.reply({
                        embeds: [embedBuilder({
                            title: '❌ Transaction Failed',
                            description: `You don't have enough **${coin}** to sell. You currently own **${currentOwned}x**.`,
                            color: '#FF0000'
                        })],
                        flags: [MessageFlags.Ephemeral]
                    });
                }

                userProfile.balance += totalYield;
                portfolio[coin] -= amount;
                updateInventory();
                
                userProfile.xp += 10;
                await userProfile.save();

                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '✅ Sale Successful',
                        description: `You sold **${amount.toLocaleString()}x ${coin}** for **$${totalYield.toLocaleString()}**.\n\nNew Wallet Balance: **$${userProfile.balance.toLocaleString()}**`,
                        color: '#00FF00'
                    })]
                });
            }

        } catch (err) {
            console.error('[CRYPTO ERROR]', err);
            interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Error', description: 'Failed to access the crypto market.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            }).catch(() => {});
        }
    }
};
