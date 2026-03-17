const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Initiates a Credit Transaction Protocol to acquire a specified asset.')
        .addStringOption(opt => 
            opt.setName('item_id')
                .setDescription('The unique identifier of the asset (see /shop).')
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemId = interaction.options.getString('item_id').toLowerCase();
        const item = shop.getItem(itemId);

        if (!item) {
            return interaction.reply({ 
                content: `\`[ERROR]\` Asset identifier \`${itemId}\` not found in database. Check \`/shop\`.`, 
                flags: 64 
            });
        }

        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        if (data.wallet < item.price) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Transaction Terminated',
                    description: `\`[INSUFFICIENT CREDITS]\` \nRequired: \`💰 ${item.price.toLocaleString()}\` \nAvailable: \`💰 ${data.wallet.toLocaleString()}\` \n\nAcquire more credits via work or daily allotments.`,
                    color: 0xED4245,
                    footer: 'Nexus Economy | SEC-TRANS-FAIL'
                })],
                flags: 64
            });
        }

        // Deduct Price
        data.wallet -= item.price;

        // Apply item logic based on type
        if (item.type === 'instant') {
            if (item.id === 'bank_upgrade') {
                data.bankCapacity += 5000;
            }
        } else {
            const ownedAmount = data.inventory.filter(i => i === item.id).length;
            
            if ((item.type === 'passive' || item.type === 'flex') && ownedAmount >= 1) {
                data.wallet += item.price; // Refund
                return interaction.reply({ 
                    content: `\`[TRANS-REJECTED]\` Subject already possesses unique asset: **${item.name}**.`, 
                    flags: 64 
                });
            }

            data.inventory.push(item.id);
        }

        economy.saveUser(userId, data);

        const embed = createEmbed({
            title: '🛍️ Transaction Authorized',
            description: `\`[PURCHASE COMPLETED]\` Asset **${item.name}** has been successfully acquired for **${item.price.toLocaleString()} Credits**.\n\nUpdated Wallet: \`💰 ${data.wallet.toLocaleString()}\``,
            color: '#00FFCC',
            footer: 'Nexus Economy | SEC-TRANS-SUCCESS'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
