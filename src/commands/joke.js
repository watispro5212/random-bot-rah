const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const JOKES = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call a belt made out of watches? A waist of time!",
    "How does a penguin build its house? Igloos it together!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the math book look sad? Because it had too many problems.",
    "What do you get when you cross a snowman and a vampire? Frostbite!"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random funny joke!'),
    async execute(interaction) {
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        const embed = createEmbed({
            title: '😂 Random Joke',
            description: joke,
            color: '#FEE75C'
        });
        await interaction.reply({ embeds: [embed] });
    },
};
