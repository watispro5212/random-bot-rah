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
        .setDescription('Drops an interactive panel to create Support Tickets.'),
    async execute(interaction) {
        
        await interaction.deferReply({ flags: 64 });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket_btn')
                .setLabel('🎫 Create Ticket')
                .setStyle(ButtonStyle.Primary)
        );

        const embed = createEmbed({
            title: '🛠️ Support Tickets',
            description: `Need help from the staff team in **${interaction.guild.name}**?\n\nClick the button below to open a private channel with the Administrators.`,
            color: '#00FFCC',
            thumbnail: interaction.guild.iconURL()
        });

        // Send the panel
        await interaction.channel.send({ embeds: [embed], components: [row] });

        // Acknowledge setup completion
        await interaction.editReply({ content: '✅ Ticket panel successfully deployed.' });
    },
};
