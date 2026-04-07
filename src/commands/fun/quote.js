const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const quotes = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
    { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
    { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
    { text: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
    { text: 'If you want to achieve greatness, stop asking for permission.', author: 'Anonymous' },
    { text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
    { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
    { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
    { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random inspirational quote.'),
    cooldown: 5,
    async execute(interaction, client) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];

        await interaction.reply({
            embeds: [embedBuilder({
                title: '💡 Inspiration',
                description: `*"${quote.text}"*\n\n— **${quote.author}**`,
                color: '#9B59B6'
            })]
        });
    },
};
