const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin — heads or tails.'),
    cooldown: 3,
    async execute(interaction, client) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '💫';

        await interaction.reply({
            embeds: [embedBuilder({
                title: `${emoji} Coin Flip`,
                description: `The coin landed on **${result}**!`,
                color: result === 'Heads' ? '#F1C40F' : '#C0C0C0'
            })]
        });
    },
};
