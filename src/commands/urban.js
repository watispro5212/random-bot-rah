const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Decrypts street-level dialect from the Urban Intelligence Database.')
        .addStringOption(option => 
            option.setName('term')
                .setDescription('The slang term to decrypt.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const term = interaction.options.getString('term');

        try {
            const query = new URLSearchParams({ term });
            const res = await fetch(`https://api.urbandictionary.com/v0/define?${query}`);
            const { list } = await res.json();

            if (!list.length) {
                return interaction.editReply(`\`[ERROR]\` No intelligence found for term: **${term}**.`);
            }

            const [answer] = list;
            
            const embed = createEmbed({
                title: `📓 Nex-Urban Intel: ${answer.word}`,
                url: answer.permalink,
                color: '#EFFF00',
                description: `\`[DECRYPTING DATA PACKETS...SUCCESS]\``,
                footer: `Intel Rating: 👍 ${answer.thumbs_up} | 👎 ${answer.thumbs_down}`
            })
            .addFields(
                { name: '📖 Primary Definition', value: `>>> ${answer.definition.substring(0, 1024) || 'No data.'}` },
                { name: '🎬 Contextual Usage', value: `>>> *${answer.example.substring(0, 1024) || 'No data.'}*` }
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('`[FATAL ERROR]` Intelligence link severed mid-transfer.');
        }
    },
};
