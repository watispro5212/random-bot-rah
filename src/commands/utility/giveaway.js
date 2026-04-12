const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a timed giveaway.')
        .addStringOption(opt => opt.setName('prize').setDescription('The prize to give away').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g., 1m, 1h, 1d)').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(10).setRequired(false)),
    cooldown: 30,
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const durationStr = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners') || 1;

        const durationMs = parseDuration(durationStr);
        if (!durationMs || durationMs < 10000 || durationMs > 7 * 24 * 60 * 60 * 1000) {
            return interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Invalid Duration', description: 'Duration must be between 10 seconds and 7 days. Use formats like `30s`, `5m`, `1h`, `1d`.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        const endTime = Date.now() + durationMs;
        const entries = new Set();

        const enterBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('giveaway_enter').setLabel('🎉 Enter Giveaway').setStyle(ButtonStyle.Primary)
        );

        const embed = embedBuilder({
            title: '🎉 GIVEAWAY',
            description: `**Prize:** ${prize}\n**Winners:** ${winnerCount}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>\n**Hosted by:** ${interaction.user}\n\n*Click the button below to enter!*\n**Entries:** 0`,
            color: '#7B2FFF'
        });

        await interaction.reply({ embeds: [embed], components: [enterBtn] });
        const msg = await interaction.fetchReply();

        const collector = msg.createMessageComponentCollector({
            filter: i => i.customId === 'giveaway_enter',
            time: durationMs
        });

        collector.on('collect', async i => {
            if (entries.has(i.user.id)) {
                return i.reply({ content: 'You have already entered this giveaway!', flags: [MessageFlags.Ephemeral] });
            }
            entries.add(i.user.id);
            await i.reply({ content: '🎉 You have entered the giveaway!', flags: [MessageFlags.Ephemeral] });

            const updatedEmbed = embedBuilder({
                title: '🎉 GIVEAWAY',
                description: `**Prize:** ${prize}\n**Winners:** ${winnerCount}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>\n**Hosted by:** ${interaction.user}\n\n*Click the button below to enter!*\n**Entries:** ${entries.size}`,
                color: '#7B2FFF'
            });
            await msg.edit({ embeds: [updatedEmbed] }).catch(() => {});
        });

        collector.on('end', async () => {
            const disabledBtn = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('giveaway_ended').setLabel('Giveaway Ended').setStyle(ButtonStyle.Secondary).setDisabled(true)
            );

            if (entries.size === 0) {
                await msg.edit({
                    embeds: [embedBuilder({ title: '🎉 GIVEAWAY ENDED', description: `**Prize:** ${prize}\n\nNo entries received. No winners selected.`, color: '#FF4444' })],
                    components: [disabledBtn]
                }).catch(() => {});
                return;
            }

            const entryArray = [...entries];
            const winners = [];
            for (let i = 0; i < Math.min(winnerCount, entryArray.length); i++) {
                const idx = Math.floor(Math.random() * entryArray.length);
                winners.push(entryArray.splice(idx, 1)[0]);
            }

            const winnerMentions = winners.map(id => `<@${id}>`).join(', ');

            await msg.edit({
                embeds: [embedBuilder({
                    title: '🎉 GIVEAWAY ENDED',
                    description: `**Prize:** ${prize}\n**Winners:** ${winnerMentions}\n\nCongratulations! 🎊\n*Total entries: ${entries.size}*`,
                    color: '#00FF88'
                })],
                components: [disabledBtn]
            }).catch(() => {});

            await msg.reply({ content: `🎉 Congratulations ${winnerMentions}! You won **${prize}**!` }).catch(() => {});
        });
    }
};

function parseDuration(str) {
    const match = str.match(/^(\d+)(s|m|h|d)$/i);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * (multipliers[unit] || 0);
}
