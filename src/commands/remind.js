const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('I\'ll keep tabs on something for you.')
        .addStringOption(option => 
            option.setName('time')
                .setDescription('When? (e.g., 10s, 5m, 1h).')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The details.')
                .setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const reason = interaction.options.getString('reason');

        const timeMatch = timeStr.match(/^(\d+)([smh])$/);
        if (!timeMatch) {
            return interaction.reply({ content: 'Format is wrong. Try something like 10s, 5m, or 1h.', flags: 64 });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2];

        let ms = 0;
        if (unit === 's') ms = value * 1000;
        else if (unit === 'm') ms = value * 60 * 1000;
        else if (unit === 'h') ms = value * 60 * 60 * 1000;

        if (ms > 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'That\'s too far out. 24 hours is my current limit.', flags: 64 });
        }

        const embed = createEmbed({
            title: '⏰ Synchronized',
            description: `I've set a pulse for: **${reason}**. Returning in **${timeStr}**.`,
            color: '#F1C40F'
        });

        await interaction.reply({ embeds: [embed], flags: 64 });

        setTimeout(async () => {
            try {
                const reminderEmbed = createEmbed({
                    title: '🔔 Alert!',
                    description: `Hey! The pulse you set for **${reason}** is up.`,
                    color: '#00FFCC'
                });

                await interaction.user.send({ embeds: [reminderEmbed] });
            } catch (error) {
                console.warn(`Could not send DM to ${interaction.user.tag} for reminder.`);
            }
        }, ms);
    },
};
