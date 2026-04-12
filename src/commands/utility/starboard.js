const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const GuildConfig = require('../../models/GuildConfig');
const { guildConfigCache } = require('../../utils/cache');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription('Configure the starboard system for highlighting popular messages.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub =>
            sub.setName('setup')
                .setDescription('Set the starboard channel and reaction threshold.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to post starred messages in.')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
                .addIntegerOption(option =>
                    option.setName('threshold')
                        .setDescription('Number of ⭐ reactions required (default: 5).')
                        .setMinValue(1)
                        .setMaxValue(50)
                        .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('disable')
                .setDescription('Disable the starboard system.'))
        .addSubcommand(sub =>
            sub.setName('status')
                .setDescription('View the current starboard configuration.')),
    cooldown: 10,
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (sub === 'setup') {
            const channel = interaction.options.getChannel('channel');
            const threshold = interaction.options.getInteger('threshold') || 5;

            await GuildConfig.findOneAndUpdate(
                { guildId },
                { starboardChannel: channel.id, starboardThreshold: threshold },
                { upsert: true }
            );

            // Invalidate cache so changes take effect immediately
            guildConfigCache.invalidate(`guild:${guildId}`);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '⭐ Starboard Configured',
                    description: [
                        `**Channel:** ${channel}`,
                        `**Threshold:** \`${threshold}\` ⭐ reactions`,
                        '',
                        'Messages that reach the threshold will be automatically posted to the starboard channel.'
                    ].join('\n'),
                    color: '#FFD700'
                })]
            });
        } else if (sub === 'disable') {
            await GuildConfig.findOneAndUpdate(
                { guildId },
                { starboardChannel: null, starboardThreshold: 5 },
                { upsert: true }
            );

            guildConfigCache.invalidate(`guild:${guildId}`);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '⭐ Starboard Disabled',
                    description: 'The starboard system has been disabled.',
                    color: '#ED4245'
                })]
            });
        } else if (sub === 'status') {
            const config = await GuildConfig.findOne({ guildId });

            if (!config?.starboardChannel) {
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '⭐ Starboard Status',
                        description: 'The starboard is **not configured** for this server.\nUse `/starboard setup` to enable it.',
                        color: '#F1C40F'
                    })],
                    flags: [MessageFlags.Ephemeral]
                });
            }

            const channel = interaction.guild.channels.cache.get(config.starboardChannel);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '⭐ Starboard Status',
                    description: [
                        `**Channel:** ${channel || 'Unknown (deleted?)'}`,
                        `**Threshold:** \`${config.starboardThreshold || 5}\` ⭐ reactions`,
                        `**Status:** ✅ Active`
                    ].join('\n'),
                    color: '#FFD700'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
