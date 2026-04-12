const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Configure auto-moderation settings.')
        .addStringOption(opt => opt.setName('setting').setDescription('The automod setting to configure')
            .setRequired(true)
            .addChoices(
                { name: 'Anti-Spam', value: 'antiSpam' },
                { name: 'Anti-Link', value: 'antiLink' },
                { name: 'Word Filter', value: 'wordFilter' },
                { name: 'View Settings', value: 'view' }
            ))
        .addStringOption(opt => opt.setName('value').setDescription('on/off or comma-separated words for word filter').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    cooldown: 5,
    async execute(interaction) {
        const setting = interaction.options.getString('setting');
        const value = interaction.options.getString('value');

        try {
            let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
            if (!config) {
                config = new GuildConfig({ guildId: interaction.guild.id });
            }

            if (setting === 'view') {
                const am = config.automod || {};
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '🛡️ Auto-Moderation Settings',
                        description: `Current configuration for **${interaction.guild.name}**`,
                        fields: [
                            { name: 'Anti-Spam', value: am.antiSpam ? '`✅ Enabled`' : '`❌ Disabled`', inline: true },
                            { name: 'Anti-Link', value: am.antiLink ? '`✅ Enabled`' : '`❌ Disabled`', inline: true },
                            { name: 'Word Filter', value: am.wordFilter ? '`✅ Enabled`' : '`❌ Disabled`', inline: true },
                            { name: 'Blacklisted Words', value: am.blacklistedWords?.length > 0 ? am.blacklistedWords.map(w => `\`${w}\``).join(', ') : '*None configured*', inline: false }
                        ],
                        color: '#00F5FF'
                    })]
                });
            }

            if (setting === 'wordFilter' && value && !['on', 'off'].includes(value.toLowerCase())) {
                const words = value.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
                config.automod.blacklistedWords = words;
                config.automod.wordFilter = true;
                await config.save();

                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '🛡️ Word Filter Updated',
                        description: `Word filter **enabled** with ${words.length} words:\n${words.map(w => `\`${w}\``).join(', ')}`,
                        color: '#00FF88'
                    })]
                });
            }

            const enabled = value?.toLowerCase() === 'on';
            config.automod[setting] = enabled;
            await config.save();

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🛡️ Auto-Moderation Updated',
                    description: `**${setting}** has been ${enabled ? '`✅ enabled`' : '`❌ disabled`'}.`,
                    color: enabled ? '#00FF88' : '#FF4444'
                })]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Error', description: 'Failed to update automod settings.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
