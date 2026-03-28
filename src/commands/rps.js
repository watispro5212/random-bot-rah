const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { replyWithMessage } = require('../utils/replyMessage');

const CHOICES = {
    rock: { emoji: '🪨', beats: 'scissors', label: 'Rock' },
    paper: { emoji: '📄', beats: 'rock', label: 'Paper' },
    scissors: { emoji: '✂️', beats: 'paper', label: 'Scissors' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Initiates a hand-gesture conflict resolution sequence (RPS).'),
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rps_rock').setEmoji('🪨').setStyle(ButtonStyle.Primary).setLabel('Rock'),
            new ButtonBuilder().setCustomId('rps_paper').setEmoji('📄').setStyle(ButtonStyle.Primary).setLabel('Paper'),
            new ButtonBuilder().setCustomId('rps_scissors').setEmoji('✂️').setStyle(ButtonStyle.Primary).setLabel('Scissors')
        );

        const embed = createEmbed({
            title: '👊 Hand-Gesture Conflict Resolution',
            description: `\`[AWAITING INPUT...]\` \n\nSelect your maneuver below.\n*Temporal window: 15 seconds.*`,
            color: '#00FFCC',
            footer: 'Nexus Combat Matrix | RPS-SEQUENCE'
        });

        const reply = await replyWithMessage(interaction, {
            embeds: [embed],
            components: [row],
        });

        const collector = reply.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            time: 15000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '\`[UNAUTHORIZED]\` Access restricted to conflict initiator.', flags: 64 });
            }

            const userChoiceId = i.customId.split('_')[1];
            const botChoiceId = Object.keys(CHOICES)[Math.floor(Math.random() * 3)];

            const userChoice = CHOICES[userChoiceId];
            const botChoice = CHOICES[botChoiceId];

            let resultLabel = '';
            let color = '#00FFCC';

            if (userChoiceId === botChoiceId) {
                resultLabel = '🤝 Sequence Standoff (Tie)';
                color = '#FFCC00';
            } else if (userChoice.beats === botChoiceId) {
                resultLabel = '🏆 Tactical Overpower (Win)';
                color = '#00FFCC';
            } else {
                resultLabel = '💀 System Dominance (Loss)';
                color = '#FF4B2B';
            }

            const resultEmbed = createEmbed({
                title: resultLabel,
                fields: [
                    { name: 'Your Selection', value: `${userChoice.emoji} ${userChoice.label}`, inline: true },
                    { name: 'Nexus Response', value: `${botChoice.emoji} ${botChoice.label}`, inline: true }
                ],
                color: color,
                footer: 'Conflict resolution final.'
            });

            await i.update({ embeds: [resultEmbed], components: [] });
            collector.stop('played');
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = createEmbed({
                    title: '⏰ Resolution Timed Out',
                    description: '\`[ABORT]\` Too slow to execute maneuver. Conflict abandoned.',
                    color: '#A3B1C6'
                });
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => null);
            }
        });
    },
};
