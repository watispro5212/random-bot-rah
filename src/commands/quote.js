const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const QUOTES = [
    "The best way to predict the future is to invent it. – Alan Kay",
    "Life is what happens when you're busy making other plans. – John Lennon",
    "Whether you think you can or you think you can't, you're right. – Henry Ford",
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Innovation distinguishes between a leader and a follower. – Steve Jobs",
    "Strive not to be a success, but rather to be of value. – Albert Einstein",
    "The mind is everything. What you think you become. – Buddha",
    "An unexamined life is not worth living. – Socrates",
    "Your time is limited, so don't waste it living someone else's life. – Steve Jobs",
    "Stay hungry, stay foolish. – Steve Jobs"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get an inspirational random quote!'),
    async execute(interaction) {
        const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        const embed = createEmbed({
            title: '📜 Random Quote',
            description: `*"${quote.split(' – ')[0]}"*\n\n— **${quote.split(' – ')[1]}**`,
            color: '#5865F2'
        });
        await interaction.reply({ embeds: [embed] });
    },
};
