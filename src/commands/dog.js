const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Initiates a biometric retrieval of a high-fidelity canine asset.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!res.ok) throw new Error('Retrieval Matrix Error');
            const data = await res.json();
            const imageUrl = data.message;

            const embed = createEmbed({
                title: '🐶 Canine Asset Retrieved',
                description: `\`[SCANNING BIOMETRICS...SUCCESS]\` \nVisual data packet processed.`,
                color: '#F1C40F',
                footer: 'Nexus Bio-Scanner | DOG-RETR-SUCCESS'
            }).setImage(imageUrl);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            await interaction.editReply('\`[ERROR]\` Could not stabilize canine data link. Retrieval failed.');
        }
    },
};
