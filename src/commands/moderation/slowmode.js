const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set channel slowmode duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode seconds (0 to disable, max 21600).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)),
    cooldown: 10,
    async execute(interaction, client) {
        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds);

            if (seconds === 0) {
                await interaction.reply({
                    embeds: [embedBuilder({
                        title: '⚡ Slowmode Disabled',
                        description: 'Message throttling has been removed from this channel.',
                        color: '#2ECC71'
                    })]
                });
            } else {
                const display = seconds >= 3600
                    ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
                    : seconds >= 60
                        ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
                        : `${seconds}s`;

                await interaction.reply({
                    embeds: [embedBuilder({
                        title: '🐌 Slowmode Enabled',
                        description: `**Duration:** \`${display}\`\n**Moderator:** ${interaction.user.tag}`,
                        color: '#F1C40F'
                    })]
                });
            }
        } catch (err) {
            await interaction.reply({ content: `❌ Failed to set slowmode: \`${err.message}\``, flags: [MessageFlags.Ephemeral] });
        }
    },
};
