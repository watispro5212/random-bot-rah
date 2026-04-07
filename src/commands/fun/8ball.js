const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const responses = [
    { text: 'It is certain.', type: 'positive' },
    { text: 'It is decidedly so.', type: 'positive' },
    { text: 'Without a doubt.', type: 'positive' },
    { text: 'Yes, definitely.', type: 'positive' },
    { text: 'You may rely on it.', type: 'positive' },
    { text: 'As I see it, yes.', type: 'positive' },
    { text: 'Most likely.', type: 'positive' },
    { text: 'Outlook good.', type: 'positive' },
    { text: 'Yes.', type: 'positive' },
    { text: 'Signs point to yes.', type: 'positive' },
    { text: 'Reply hazy, try again.', type: 'neutral' },
    { text: 'Ask again later.', type: 'neutral' },
    { text: 'Better not tell you now.', type: 'neutral' },
    { text: 'Cannot predict now.', type: 'neutral' },
    { text: 'Concentrate and ask again.', type: 'neutral' },
    { text: 'Don\'t count on it.', type: 'negative' },
    { text: 'My reply is no.', type: 'negative' },
    { text: 'My sources say no.', type: 'negative' },
    { text: 'Outlook not so good.', type: 'negative' },
    { text: 'Very doubtful.', type: 'negative' },
];

const colors = {
    positive: '#2ECC71',
    neutral: '#F1C40F',
    negative: '#ED4245'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a yes/no question.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question for the oracle.')
                .setRequired(true)),
    cooldown: 5,
    async execute(interaction, client) {
        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🎱 Magic 8-Ball',
                fields: [
                    { name: '❓ Question', value: question, inline: false },
                    { name: '🔮 Answer', value: `**${response.text}**`, inline: false }
                ],
                color: colors[response.type]
            })]
        });
    },
};
