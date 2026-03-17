const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Executes a binary probability sequence (Heads or Tails).'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '⚪';

        const embed = createEmbed({
            title: '🎲 Probability Analysis',
            description: `\`[GENERATING RANDOM SEED...]\` \n\nThe probability sequence has settled on...\n\n# ${emoji} **${result.toUpperCase()}**`,
            color: result === 'Heads' ? '#F1C40F' : '#A3B1C6',
            footer: 'Nexus Prob-Sys | BIN-SEQ-SET'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
