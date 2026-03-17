const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Decrypts and translates textual data packets into a specified language.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The source text to decrypt.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('to')
                .setDescription('The target language code (e.g., en, es, zh, ja).')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const text = interaction.options.getString('text');
        const targetLang = interaction.options.getString('to');

        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
            const data = await res.json();

            if (data.responseStatus !== 200) {
                return interaction.editReply(`\`[FATAL ERROR]\` Translation matrix offline: ${data.responseDetails}`);
            }

            const translatedText = data.responseData.translatedText;

            const embed = createEmbed({
                title: '🌍 Polyglot Translation Matrix',
                description: `\`[DECODING...ACCESSING LINGUISTIC DATABASE...SUCCESS]\``,
                color: '#2ECC71',
                footer: `Protocol: MyMemory | Target Lang: ${targetLang.toUpperCase()}`
            })
            .addFields(
                { name: '📥 Source Signal', value: `>>> ${text}` },
                { name: '📤 Decrypted Signal', value: `>>> **${translatedText}**` }
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('`[ERROR]` Translation core encountered a syntax anomaly.');
        }
    },
};
