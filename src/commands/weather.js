const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Initiates a satellite scan of atmospheric conditions.')
        .addStringOption(option => 
            option.setName('city')
                .setDescription('The geographic sector to scan.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const city = interaction.options.getString('city');

        try {
            const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            if (!res.ok) throw new Error('Satellite Link Failure');
            
            const data = await res.json();
            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            const embed = createEmbed({
                title: `🛰️ Atmospheric Scan: ${area.areaName[0].value}, ${area.country[0].value}`,
                description: `\`[STATUS]\` **${current.weatherDesc[0].value.toUpperCase()}**`,
                color: '#00FFCC',
                footer: 'Data Stream: wttr.in | Nexus Orbital Services'
            })
            .addFields(
                { name: '🌡️ Core Temp', value: `\`${current.temp_C}°C\` / \`${current.temp_F}°F\``, inline: true },
                { name: '🧊 Perception', value: `\`${current.FeelsLikeC}°C\` / \`${current.FeelsLikeF}°F\``, inline: true },
                { name: '💧 Humidity', value: `\`${current.humidity}%\``, inline: true },
                { name: '🌪️ Wind Flux', value: `\`${current.windspeedKmph} km/h\``, inline: true }
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('`[ERROR]` Sector scan timed out. Satellite link unstable.');
        }
    },
};
