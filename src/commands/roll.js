const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Executes a multi-sided randomization pulse (Dice Roll).')
        .addIntegerOption(option => 
            option.setName('sides')
                .setDescription('Number of faces on the randomization module (default: 6).')
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)),
    async execute(interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        const embed = createEmbed({
            title: `🎲 Randomization Pulse: d${sides}`,
            description: `\`[GENERATING ENTROPY...]\` \n\nThe module has settled on: \n# **${result}**`,
            color: '#00FFCC',
            footer: 'Nexus Prob-Sys | RAND-PULSE-SET'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
