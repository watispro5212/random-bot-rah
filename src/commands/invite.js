const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get a direct authorization link to add Nexus Protocol to your server.'),
    async execute(interaction) {
        // Fallback to env or hardcoded Client ID
        const clientId = process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID || '1480725340753101031';
        
        // Cleaned up standard authorization URL requesting bot and slash commands
        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

        const embed = createEmbed({
            title: '🔗 Integrate Nexus Protocol',
            description: 
                'Ready to supercharge your server? Click the button below to authorize the bot.\n\n' +
                '**⚠️ Important Setup Notes:**\n' +
                '• You must have **Manage Server** permissions to add the bot.\n' +
                '• Once successfully invited, make sure to drag the **`🤖 Nexus Bot`** role high up in your role hierarchy in Server Settings so it can enforce moderation and manage channels seamlessly.',
            color: '#00FFCC',
            thumbnail: interaction.client.user.displayAvatarURL(),
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Add to Server')
                .setStyle(ButtonStyle.Link)
                .setURL(url),
            // Added an extra button for support/info if they need help setting it up
            new ButtonBuilder()
                .setLabel('Documentation')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/watispro5212/NexusBot/blob/main/README.md') 
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
