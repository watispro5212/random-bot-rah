const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Initiates a biometric retrieval of a high-fidelity feline asset.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://api.thecatapi.com/v1/images/search');
            if (!res.ok) throw new Error('Retrieval Matrix Error');
            const data = await res.json();
            const imageUrl = data[0].url;

            const embed = createEmbed({
                title: '🐱 Feline Asset Retrieved',
                description: `\`[SCANNING BIOMETRICS...SUCCESS]\` \nVisual data packet processed.`,
                color: '#FFCC00',
                footer: 'Nexus Bio-Scanner | CAT-RETR-SUCCESS'
            }).setImage(imageUrl);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply('\`[ERROR]\` Could not stabilize feline data link. Retrieval failed.');
        }
    },
};
