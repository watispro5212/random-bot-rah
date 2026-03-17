const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const shop = require('../utils/ShopManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Accesses neural data storage to view acquired assets.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('Biometrically scan another user\'s inventory.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.reply({ content: '`[ERROR]` Synthetic entities do not maintain physical inventories.', flags: 64 });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        
        if (!data.inventory || data.inventory.length === 0) {
            const emptyEmbed = createEmbed({
                title: `🎒 ${target.username}'s Inventory`,
                description: `\`[STATUS: EMPTY]\` \nThis storage unit contains no physical assets. \n*Access \`/shop\` to acquire new gear.*`,
                color: '#A3B1C6',
                footer: 'Nexus Asset Manager | INV-EMPTY'
            });
            return interaction.reply({ embeds: [emptyEmbed] });
        }

        const counts = {};
        for (const itemId of data.inventory) {
            counts[itemId] = (counts[itemId] || 0) + 1;
        }

        let description = `\`[SCANNING ASSETS...]\` \n\n`;
        for (const [id, count] of Object.entries(counts)) {
            const itemDef = shop.getItem(id);
            if (itemDef) {
                description += `**${itemDef.name}** ─ \`x${count}\`\n> *${itemDef.description}*\n\n`;
            } else {
                description += `❓ **Unknown Tech** (\`${id}\`) ─ \`x${count}\`\n\n`;
            }
        }

        const embed = createEmbed({
            title: `🎒 ${target.username}'s Data Storage`,
            thumbnail: target.displayAvatarURL(),
            description: description,
            color: '#FFCC00',
            footer: 'Nexus Asset Manager | INV-SCAN-COMPLETE'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
