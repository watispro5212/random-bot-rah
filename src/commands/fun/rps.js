const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const choices = ['🪨 Rock', '📄 Paper', '✂️ Scissors'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock Paper Scissors against the bot.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Your move.')
                .setRequired(true)
                .addChoices(
                    { name: '🪨 Rock', value: '0' },
                    { name: '📄 Paper', value: '1' },
                    { name: '✂️ Scissors', value: '2' }
                )),
    cooldown: 3,
    async execute(interaction, client) {
        const playerChoice = parseInt(interaction.options.getString('choice'));
        const botChoice = Math.floor(Math.random() * 3);

        const playerDisplay = choices[playerChoice];
        const botDisplay = choices[botChoice];

        let result, color;

        if (playerChoice === botChoice) {
            result = '🤝 It\'s a tie!';
            color = '#F1C40F';
        } else if ((playerChoice + 1) % 3 === botChoice) {
            result = '❌ You lose!';
            color = '#ED4245';
        } else {
            result = '🎉 You win!';
            color = '#2ECC71';
        }

        await interaction.reply({
            embeds: [embedBuilder({
                title: '✊ Rock Paper Scissors',
                fields: [
                    { name: 'Your Pick', value: playerDisplay, inline: true },
                    { name: 'vs', value: '⚔️', inline: true },
                    { name: 'Bot\'s Pick', value: botDisplay, inline: true },
                ],
                description: `\n**${result}**`,
                color
            })]
        });
    },
};
