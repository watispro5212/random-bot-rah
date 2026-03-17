const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Extracts the holographic core iconography of the current Nexus sector.'),
    async execute(interaction) {
        const guild = interaction.guild;
        
        if (!guild.iconURL()) {
            return interaction.reply({ 
                content: '`[ERROR]` This sector does not maintain a custom visual core.', 
                flags: 64 
            });
        }

        const iconUrl = guild.iconURL({ dynamic: true, size: 4096 });

        const embed = createEmbed({
            title: `🖼️ Sector Core Captured: ${guild.name}`,
            description: `\`[RESOLUTION: 4096px | ACCESS: GLOBAL]\` \nVisual data extracted from sector metadata.`,
            url: iconUrl,
            color: '#00FFCC',
            footer: `Sector ID: ${guild.id} | Scanned by ${interaction.user.tag}`
        }).setImage(iconUrl);

        await interaction.reply({ embeds: [embed] });
    },
};
