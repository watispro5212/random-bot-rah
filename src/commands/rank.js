const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

function getXpRequirement(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

function generateProgressBar(current, max, length = 10) {
    const progress = Math.min(Math.max(current / max, 0), 1);
    const filledCount = Math.round(progress * length);
    const emptyCount = length - filledCount;
    
    const filled = '🟩'.repeat(filledCount);
    const empty = '⬛'.repeat(emptyCount);
    
    const percentage = Math.floor(progress * 100);
    return `[ ${filled}${empty} ] **${percentage}%**`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Displays your current Level and XP progress.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('View another user\'s rank')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.reply({ content: 'Bots don\'t earn XP!', flags: 64 });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        const requiredXp = getXpRequirement(data.level);

        const embed = createEmbed({
            title: `🏆 ${target.username}'s Rank`,
            thumbnail: target.displayAvatarURL({ dynamic: true }),
            description: `**Level:** ${data.level}\n**Total XP:** ${data.xp} / ${requiredXp}\n\n${generateProgressBar(data.xp, requiredXp)}\n\n*Chat in servers to earn XP passively and level up!*`,
            color: '#00FFCC'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
