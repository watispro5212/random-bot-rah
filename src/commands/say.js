const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Executes a high-priority cleartext broadcast through the Nexus sector.')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The cleartext payload to broadcast.')
                .setRequired(true))
        ,
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        await interaction.reply({ content: '\`[SYSTEM]\` Transmission successfully prioritized and sent.', flags: 64 });
        
        await interaction.channel.send(`\`🚀 [BROADCAST]\` \n${message}`);
    },
};
