const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Extract the high-resolution icon of the current Nexus node (server).'),
    async execute(interaction) {
        const guild = interaction.guild;
        
        if (!guild.iconURL()) {
            return interaction.reply({ 
                content: 'This node does not have a custom icon set.', 
                flags: 64 
            });
        }

        const iconUrl = guild.iconURL({ dynamic: true, size: 4096 });

        const embed = createEmbed({
            title: `🖼️ Server Icon: ${guild.name}`,
            url: iconUrl,
            color: '#00FFCC'
        }).setImage(iconUrl);

        await interaction.reply({ embeds: [embed] });
    },
};
