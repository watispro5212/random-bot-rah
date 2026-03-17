const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View the items you have purchased from the shop.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('View another user\'s inventory')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.reply({ content: 'Bots do not have inventories!', flags: 64 });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        
        if (!data.inventory || data.inventory.length === 0) {
            const emptyEmbed = createEmbed({
                title: `🎒 ${target.username}'s Inventory`,
                description: 'This inventory is completely empty!\n*Visit the `/shop` to buy items.*',
                color: '#A3B1C6'
            });
            return interaction.reply({ embeds: [emptyEmbed] });
        }

        // Tally items up into quantities
        const counts = {};
        for (const itemId of data.inventory) {
            counts[itemId] = (counts[itemId] || 0) + 1;
        }

        // Build list
        let description = '';
        for (const [id, count] of Object.entries(counts)) {
            const itemDef = shop.getItem(id);
            if (itemDef) {
                description += `**${itemDef.name}** ─ \`x${count}\`\n*${itemDef.description}*\n\n`;
            } else {
                description += `❓ Unknown Item (\`${id}\`) ─ \`x${count}\`\n\n`;
            }
        }

        const embed = createEmbed({
            title: `🎒 ${target.username}'s Inventory`,
            thumbnail: target.displayAvatarURL(),
            description: description,
            color: '#FFCC00'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
