const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Clone this channel and delete the original (full wipe).')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    cooldown: 60,
    async execute(interaction, client) {
        const channel = interaction.channel;

        await interaction.reply({
            embeds: [embedBuilder({
                title: '☢️ Channel Nuke Initiated',
                description: 'Cloning channel and destroying original in **5 seconds**...\nThis action cannot be undone.',
                color: '#ED4245'
            })]
        });

        setTimeout(async () => {
            try {
                const newChannel = await channel.clone();
                await newChannel.setPosition(channel.position);
                await channel.delete('Channel nuked by admin.');

                await newChannel.send({
                    embeds: [embedBuilder({
                        title: '☢️ Channel Nuked',
                        description: `This channel was reset by ${interaction.user.tag}.\nAll previous messages have been destroyed.`,
                        color: '#ED4245'
                    })]
                });
            } catch (err) {
                // Channel may already be deleted
            }
        }, 5000);
    },
};
