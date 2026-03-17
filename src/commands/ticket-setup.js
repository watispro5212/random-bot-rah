const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    PermissionFlagsBits 
} = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Deploys a Support Matrix Uplink panel for sector residents.')
        ,
    async execute(interaction) {
        
        await interaction.deferReply({ flags: 64 });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket_btn')
                .setLabel('🎫 Initialize Uplink')
                .setStyle(ButtonStyle.Primary)
        );

        const embed = createEmbed({
            title: '🛠️ Support Matrix Uplink',
            description: `Required assistance within **${interaction.guild.name}**?\n\nExecute the button below to initialize a high-security encrypted line with the Administrators.`,
            color: '#00FFCC',
            thumbnail: interaction.guild.iconURL(),
            footer: 'Nexus Support System | ENCRYPTED-LINE'
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({ content: '\`[SUCCESS]\` Support Matrix Uplink successfully deployed.' });
    },
};
