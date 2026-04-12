const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const logger = require('../../utils/logger');

module.exports = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Gracefully terminates all protocol shards and closes database uplinks.')
        .setDefaultMemberPermissions(0),
    async execute(interaction, client) {
        const confirmEmbed = embedBuilder({
            title: '⏹️ Protocol Termination',
            description: 'Initiating global shutdown sequence. All shards will be disconnected.',
            color: '#E74C3C'
        });

        await interaction.reply({ embeds: [confirmEmbed], flags: [MessageFlags.Ephemeral] });
        
        logger.warn(`Shutdown command executed by ${interaction.user.tag}. Shutting down...`);
        
        
        setTimeout(() => {
            process.exit(0); 
        }, 1000);
    },
};
