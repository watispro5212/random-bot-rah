const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(opt => 
            opt.setName('item_id')
                .setDescription('The ID of the item (seen in /shop)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemId = interaction.options.getString('item_id').toLowerCase();
        const item = shop.getItem(itemId);

        if (!item) {
            return interaction.reply({ 
                content: `Could not find an item with the ID \`${itemId}\`. Please check \`/shop\`.`, 
                flags: 64 
            });
        }

        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        if (data.wallet < item.price) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Funds',
                    description: `You need **${item.price.toLocaleString()} Credits** to buy **${item.name}**, but you only have **${data.wallet.toLocaleString()} Credits** in your wallet.`,
                    color: 0xED4245
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
            // Add more instant effects here in the future
        } else {
            // Check if they already maxed it out
            const ownedAmount = data.inventory.filter(i => i === item.id).length;
            
            // For now, let's limit flex/passive badges to 1 per person
            if ((item.type === 'passive' || item.type === 'flex') && ownedAmount >= 1) {
                // Refund
                data.wallet += item.price;
                return interaction.reply({ content: `You already own **${item.name}** and cannot buy duplicates.`, flags: 64 });
            }

            // Consumables can be stacked
            data.inventory.push(item.id);
        }

        await data.save();

        const embed = createEmbed({
            title: '🛍️ Purchase Successful!',
            description: `You have successfully purchased **${item.name}** for **${item.price.toLocaleString()} Credits**!\n\nYour new wallet balance is **${data.wallet.toLocaleString()} Credits**.`,
            color: '#00FFCC'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
