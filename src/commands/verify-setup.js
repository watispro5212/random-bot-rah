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
        .setDescription('Deploys a Biometric Verification Node into the current sector.')
        ,
    async execute(interaction) {
        
        await interaction.deferReply({ flags: 64 });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_role_button')
                .setLabel('🛂 Authenticate Identity')
                .setStyle(ButtonStyle.Success)
        );

        const embed = createEmbed({
            title: '🛡️ Biometric Verification Node',
            description: `Welcome to sector **${interaction.guild.name}**.\n\nTo prove your neural authenticity and gain access to secure channels, please click the authentication button below.`,
            color: '#00FFCC',
            thumbnail: interaction.guild.iconURL(),
            footer: 'Nexus Security | BIO-AUTH-NODE'
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({ content: '\`[SUCCESS]\` Biometric Verification Node successfully deployed.' });
    },
};
