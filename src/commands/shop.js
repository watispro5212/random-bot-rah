const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Accesses the Nexus Credit Exchange for asset acquisition.'),
    async execute(interaction) {
        
        const items = shop.getAllItems();
        
        const fields = items.map(item => ({
            name: `${item.name} ─ \`💰 ${item.price.toLocaleString()}\``,
            value: `*${item.description}*\n> **Command:** \`/buy item:${item.id}\``,
            inline: false
        }));

        const embed = createEmbed({
            title: '🛒 Nexus Credit Exchange',
            description: `\`[TERMINAL CONNECTED]\` Select an asset to initiate purchase sequence.\nHard-earned credits are required for all transactions.`,
            fields: fields,
            color: '#D800FF',
            footer: 'Nexus Economy | SEC-SHOP-LIST'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
