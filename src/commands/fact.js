const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const FACTS = [
    "Honey never spoils. You can eat 3,000-year-old honey!",
    "Octopuses have three hearts.",
    "A day on Venus is longer than a year on Venus.",
    "Bananas are berries, but strawberries aren't.",
    "There are more trees on Earth than stars in the Milky Way.",
    "A cloud can weigh more than a million pounds.",
    "Dead people can get goosebumps.",
    "The inventor of the Pringles can is now buried in one.",
    "Wombat poop is cube-shaped.",
    "The total weight of all the ants on Earth is about the same as all the humans."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random interesting fact!'),
    async execute(interaction) {
        const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
        const embed = createEmbed({
            title: '💡 Random Fact',
            description: fact,
            color: '#10b981'
        });
        await interaction.reply({ embeds: [embed] });
    },
};
