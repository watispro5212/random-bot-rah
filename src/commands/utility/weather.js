const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Queries atmospheric sensors for a specific global coordinate.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The city or region to scan.')
                .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return interaction.reply({ 
                content: '⚠️ Atmospheric sensors are offline (Missing API Key).', 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        await interaction.deferReply();

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();

            const weatherEmbed = embedBuilder({
                title: `Weather Report — ${data.name}`,
                description: `Conditions in your sector: **${data.weather[0].main}**`,
                fields: [
                    { name: 'Temperature', value: `${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)`, inline: true },
                    { name: 'Humidity', value: `${data.main.humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${data.wind.speed} m/s`, inline: true }
                ],
                thumbnail: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                color: '#00F5FF'
            });

            await interaction.editReply({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Weather fetch error:', error);
            await interaction.editReply({ 
                content: `Failed to query atmospheric sensors for \`${location}\`. Ensure the location identifier is correct.` 
            });
        }
    },
};
