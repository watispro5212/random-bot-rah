const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { replyWithMessage } = require('../utils/replyMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Initiates a consensus protocol vote for the current sector.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The neural prompt for the consensus vote.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('options')
                .setDescription('Consensus options separated by commas (Max: 10).')
                .setRequired(true))
        ,
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const optionsList = interaction.options.getString('options').split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (optionsList.length < 2) {
            return interaction.reply({ content: '\`[ERROR]\` Consensus requires at least 2 distinct data points.', flags: 64 });
        }

        if (optionsList.length > 10) {
            return interaction.reply({ content: '\`[LIMIT]\` Consensus matrix cannot exceed 10 data points.', flags: 64 });
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let description = '';

        for (let i = 0; i < optionsList.length; i++) {
            description += `\`[ ${i + 1} ]\` ${optionsList[i]}\n\n`;
        }

        const embed = createEmbed({
            title: `📊 Consensus Protocol: ${question}`,
            description: `\`[OPEN FOR VOTE]\` \n\n${description}`,
            color: '#00FFCC',
            footer: `Protocol Initiator: ${interaction.user.tag} | Nexus Governance`
        });

        const message = await replyWithMessage(interaction, {
            embeds: [embed],
        });
        
        for (let i = 0; i < optionsList.length; i++) {
            await message.react(emojis[i]);
        }
    },
};
