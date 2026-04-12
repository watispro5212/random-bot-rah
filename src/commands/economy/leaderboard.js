const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

const ITEMS_PER_PAGE = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top operatives in this server.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Leaderboard type to view.')
                .setRequired(false)
                .addChoices(
                    { name: 'Balance (Net Worth)', value: 'balance' },
                    { name: 'XP & Level', value: 'xp' },
                    { name: 'Reputation', value: 'rep' }
                )),
    cooldown: 10,
    async execute(interaction, client) {
        const type = interaction.options.getString('type') || 'balance';
        const guildId = interaction.guild.id;

        let sortField, title, formatEntry;

        switch (type) {
            case 'xp':
                sortField = { level: -1, xp: -1 };
                title = '🏆 XP Leaderboard';
                formatEntry = (u, name) => `**${name}** — Level \`${u.level}\` (${u.xp.toLocaleString()} XP)`;
                break;
            case 'rep':
                sortField = { reputation: -1 };
                title = '🏆 Reputation Leaderboard';
                formatEntry = (u, name) => `**${name}** — \`${u.reputation}\` ⭐ reputation`;
                break;
            default:
                sortField = { balance: -1 };
                title = '🏆 Wealth Leaderboard';
                formatEntry = (u, name) => {
                    const net = u.balance + u.bank;
                    return `**${name}** — $${net.toLocaleString()} (💵 $${u.balance.toLocaleString()} | 🏦 $${u.bank.toLocaleString()})`;
                };
        }

        const allUsers = await User.find({ guildId }).sort(sortField);

        if (allUsers.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: `${title} — Empty`,
                    description: 'No activity detected in this server yet.',
                    color: '#ED4245'
                })]
            });
        }

        const totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
        let currentPage = 0;
        const medals = ['🥇', '🥈', '🥉'];

        const buildPage = async (page) => {
            const start = page * ITEMS_PER_PAGE;
            const pageUsers = allUsers.slice(start, start + ITEMS_PER_PAGE);

            const lines = await Promise.all(
                pageUsers.map(async (u, i) => {
                    const rank = start + i;
                    const prefix = medals[rank] || `\`#${rank + 1}\``;
                    try {
                        const member = await interaction.guild.members.fetch(u.userId).catch(() => null);
                        const name = member ? member.displayName : `Unknown (${u.userId.slice(-4)})`;
                        return `${prefix} ${formatEntry(u, name)}`;
                    } catch {
                        return `${prefix} ${formatEntry(u, 'Unknown')}`;
                    }
                })
            );

            return embedBuilder({
                title,
                description: lines.join('\n'),
                color: '#F1C40F',
                footer: `${interaction.guild.name} • Page ${page + 1}/${totalPages} • ${allUsers.length} total`
            });
        };

        const buildButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('lb_first')
                    .setLabel('⏮')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('lb_prev')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('lb_page')
                    .setLabel(`${page + 1}/${totalPages}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('lb_next')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page >= totalPages - 1),
                new ButtonBuilder()
                    .setCustomId('lb_last')
                    .setLabel('⏭')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page >= totalPages - 1)
            );
        };

        const embed = await buildPage(0);
        const msg = await interaction.reply({
            embeds: [embed],
            components: totalPages > 1 ? [buildButtons(0)] : [],
            fetchReply: true
        });

        if (totalPages <= 1) return;

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120000
        });

        collector.on('collect', async (btn) => {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: '❌ This isn\'t your leaderboard.', flags: [MessageFlags.Ephemeral] });
            }

            switch (btn.customId) {
                case 'lb_first': currentPage = 0; break;
                case 'lb_prev': currentPage = Math.max(0, currentPage - 1); break;
                case 'lb_next': currentPage = Math.min(totalPages - 1, currentPage + 1); break;
                case 'lb_last': currentPage = totalPages - 1; break;
            }

            const newEmbed = await buildPage(currentPage);
            await btn.update({
                embeds: [newEmbed],
                components: [buildButtons(currentPage)]
            });
        });

        collector.on('end', () => {
            msg.edit({ components: [] }).catch(() => {});
        });
    },
};
