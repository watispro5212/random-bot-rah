const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cyber-heist')
        .setDescription('Initiate a multi-stage security breach to siphon Nexus credits.'),
    async execute(interaction) {
        const user = await economy.getUser(interaction.user.id, interaction.guild.id);
        if (!user) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: 'Access Denied',
                    description: '`[ERROR]` Could not load your economy profile.',
                    type: 'error',
                })],
                flags: 64,
            });
        }

        if (user.wallet < 500) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: 'Access Denied',
                    description: 'You need at least `500` Credits in your **wallet** to bypass the initial firewall uplink.',
                    type: 'error',
                })],
                flags: 64,
            });
        }

        const initialEmbed = createEmbed({
            title: 'Cyber-Heist: Security Breach',
            description: '`[UPLINK ESTABLISHED]`\nYou are attempting to breach the Central Reserve. Choose your entry point carefully. A failure will result in a heavy credit fine.',
            fields: [
                { name: 'Target Tier', value: 'Level 1 Security Zone', inline: true },
                { name: 'Risk Level', value: 'Moderate', inline: true },
                { name: 'Entry Cost', value: '500 Credits', inline: true },
            ],
            color: '#BC13FE',
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('heist_port_1').setLabel('Port 80 (HTTP)').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('heist_port_2').setLabel('Port 22 (SSH)').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('heist_port_3').setLabel('Port 443 (SSL)').setStyle(ButtonStyle.Secondary),
        );

        await interaction.reply({
            embeds: [initialEmbed],
            components: [row],
        });

        const msg = await interaction.fetchReply();
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000,
        });

        const winningPort = `heist_port_${Math.floor(Math.random() * 3) + 1}`;

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Unauthorized access.', flags: 64 });
            }

            await i.deferUpdate();

            if (i.customId === winningPort) {
                const loot = Math.floor(Math.random() * 1500) + 1000;
                await economy.addBalance(interaction.user.id, interaction.guild.id, loot);

                const winEmbed = createEmbed({
                    title: 'Heist Success',
                    description: `\`[BREACH SUCCESSFUL]\` \nYou successfully bypassed the node security and siphoned **${loot}** credits before the traceback completed.`,
                    type: 'success',
                });

                await interaction.editReply({ embeds: [winEmbed], components: [] });
            } else {
                const penalty = 500;
                await economy.addBalance(interaction.user.id, interaction.guild.id, -penalty);

                const loseEmbed = createEmbed({
                    title: 'Heist Failed',
                    description: `\`[TRACEBACK DETECTED]\` \nThe system traced your signal and fried your local wallet. You lost **${penalty}** credits in the emergency disconnect.`,
                    type: 'error',
                });

                await interaction.editReply({ embeds: [loseEmbed], components: [] });
            }
            collector.stop();
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                interaction.editReply({ components: [] }).catch(() => null);
            }
        });
    },
};
