const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Transmit a cleartext message through the Nexus.')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to transmit.')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        // Acknowledge the interaction so Discord doesn't timeout
        await interaction.reply({ content: 'Transmission sent.', flags: 64 });
        
        // Send the actual message
        await interaction.channel.send(message);
    },
};
