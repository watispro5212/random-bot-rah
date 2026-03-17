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
        .setName('verify-setup')
        .setDescription('Drops an interactive panel into this channel that users can click to get verified.'),
    async execute(interaction) {
        
        await interaction.deferReply({ flags: 64 });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_role_button')
                .setLabel('✅ Click Here to Verify')
                .setStyle(ButtonStyle.Success)
        );

        const embed = createEmbed({
            title: '🛂 Server Verification',
            description: `Welcome to **${interaction.guild.name}**!\n\nTo prove you are human and gain access to the rest of the server, please click the button below.`,
            color: '#00FFCC',
            thumbnail: interaction.guild.iconURL()
        });

        // Send the panel
        await interaction.channel.send({ embeds: [embed], components: [row] });

        // Acknowledge setup completion
        await interaction.editReply({ content: '✅ Verification panel successfully deployed to this channel.' });
    },
};
