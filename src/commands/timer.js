const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Sets a temporary temporal countdown that will ping your neural link when finished.')
        .addIntegerOption(option => 
            option.setName('minutes')
                .setDescription('Temporal duration in minutes.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1440))
        .addStringOption(option => 
            option.setName('reminder')
                .setDescription('The neural prompt to trigger upon completion.')
                .setRequired(false)),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const reminder = interaction.options.getString('reminder') || 'Temporal countdown completed.';
        const ms = minutes * 60 * 1000;
        const endTime = new Date(Date.now() + ms);

        const embed = createEmbed({
            title: '⏱️ Temporal Countdown Initiated',
            description: `\`[SYNCING]\` Neural link scheduled for: <t:${Math.floor(endTime.getTime() / 1000)}:R>\n\n**Prompt:** \`${reminder}\``,
            color: '#00FFCC',
            footer: 'Nexus Timekeeper | SEQ-TIMER-START'
        });

        await interaction.reply({ embeds: [embed] });
        logger.info(`${interaction.user.tag} set a ${minutes}m timer.`);

        setTimeout(async () => {
            const upEmbed = createEmbed({
                title: '⏰ Temporal Link Triggered!',
                description: `\`[ALERT]\` Countdown sequence finished.\n\n**Prompt:** \`${reminder}\``,
                color: '#FFCC00',
                footer: 'Nexus Timekeeper | SEQ-TIMER-END'
            });

            try {
                await interaction.followUp({ 
                    content: `<@${interaction.user.id}>`, 
                    embeds: [upEmbed] 
                });
            } catch (error) {
                await interaction.user.send({ embeds: [upEmbed] }).catch(() => null);
            }
        }, ms);
    },
};
