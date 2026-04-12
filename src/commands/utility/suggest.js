const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion for the server.')
        .addStringOption(option =>
            option.setName('idea')
                .setDescription('Your suggestion or idea.')
                .setRequired(true)
                .setMaxLength(1024)),
    cooldown: 30,
    async execute(interaction) {
        const idea = interaction.options.getString('idea');

        const config = await GuildConfig.findOne({ guildId: interaction.guild.id });

        if (!config?.suggestionsChannel) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Not Configured',
                    description: 'No suggestions channel has been set up.\nAsk an admin to use `/config` to set one.',
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const channel = interaction.guild.channels.cache.get(config.suggestionsChannel);
        if (!channel) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Channel Not Found',
                    description: 'The configured suggestions channel no longer exists.',
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const suggestionEmbed = embedBuilder({
            title: '💡 New Suggestion',
            description: idea,
            fields: [
                { name: 'Submitted By', value: `${interaction.user} (\`${interaction.user.tag}\`)`, inline: true },
                { name: 'Status', value: '🟡 Pending Review', inline: true }
            ],
            color: '#FFD700',
            thumbnail: interaction.user.displayAvatarURL({ dynamic: true, size: 128 })
        });

        try {
            const msg = await channel.send({ embeds: [suggestionEmbed] });
            await msg.react('👍');
            await msg.react('👎');

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '✅ Suggestion Submitted',
                    description: `Your suggestion has been posted to ${channel}.\nThe community can now vote on it!`,
                    color: '#2ECC71'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        } catch (err) {
            await interaction.reply({
                content: `❌ Failed to post suggestion: \`${err.message}\``,
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
