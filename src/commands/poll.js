const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Fire up a quick community vote.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The topic of the vote.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('options')
                .setDescription('Separate options with commas (max 10).')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const optionsList = interaction.options.getString('options').split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (optionsList.length < 2) {
            return interaction.reply({ content: 'I need at least 2 options to start a vote.', flags: 64 });
        }

        if (optionsList.length > 10) {
            return interaction.reply({ content: 'Hold on, 10 options is the max limit.', flags: 64 });
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let description = '';

        for (let i = 0; i < optionsList.length; i++) {
            description += `${emojis[i]} ${optionsList[i]}\n\n`;
        }

        const embed = createEmbed({
            title: `📊 ${question}`,
            description: description,
            color: '#00FFCC'
        }).setFooter({ text: `Oracle: ${interaction.user.tag}` });

        const message = await interaction.reply({ embeds: [embed], withResponse: true });

        for (let i = 0; i < optionsList.length; i++) {
            await message.react(emojis[i]);
        }
    },
};
