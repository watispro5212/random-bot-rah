const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a personal reminder — you\'ll be DM\'d when the time is up.')
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minutes from now (1-1440).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1440))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What to remind you about.')
                .setRequired(true)),
    cooldown: 10,
    async execute(interaction, client) {
        const minutes = interaction.options.getInteger('minutes');
        const message = interaction.options.getString('message');

        await interaction.reply({
            embeds: [embedBuilder({
                title: '⏰ Reminder Set!',
                description: `I'll DM you in **${minutes} minute${minutes !== 1 ? 's' : ''}**.\n**Reminder:** ${message}`,
                color: '#3498DB'
            })],
            flags: [MessageFlags.Ephemeral]
        });

        setTimeout(async () => {
            try {
                await interaction.user.send({
                    embeds: [embedBuilder({
                        title: '⏰ Reminder!',
                        description: `You asked me to remind you:\n\n**${message}**`,
                        fields: [
                            { name: 'Set', value: `${minutes} minute${minutes !== 1 ? 's' : ''} ago`, inline: true },
                            { name: 'Server', value: interaction.guild?.name || 'Unknown', inline: true }
                        ],
                        color: '#F1C40F'
                    })]
                });
            } catch (err) {
                
            }
        }, minutes * 60 * 1000);
    },
};
