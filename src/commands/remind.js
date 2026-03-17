const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Anchors a neural memory trace for a specified temporal window.')
        .addStringOption(option => 
            option.setName('time')
                .setDescription('Temporal offset (e.g., 10s, 5m, 1h).')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The neural data to archive.')
                .setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const reason = interaction.options.getString('reason');

        const timeMatch = timeStr.match(/^(\d+)([smh])$/);
        if (!timeMatch) {
            return interaction.reply({ 
                content: '`[ERROR]` Invalid temporal syntax. Use formats such as `10s`, `5m`, or `1h`.', 
                flags: 64 
            });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2];

        let ms = 0;
        if (unit === 's') ms = value * 1000;
        else if (unit === 'm') ms = value * 60 * 1000;
        else if (unit === 'h') ms = value * 60 * 60 * 1000;

        if (ms > 24 * 60 * 60 * 1000) {
            return interaction.reply({ 
                content: '`[LIMIT EXCEEDED]` Neural anchors cannot exceed a 24-hour temporal window.', 
                flags: 64 
            });
        }

        const embed = createEmbed({
            title: '🧠 Neural Memory Anchored',
            description: `\`[ARCHIVED]\` **Data Point:** \`${reason}\` \nLink established: <t:${Math.floor((Date.now() + ms) / 1000)}:R>`,
            color: '#F1C40F',
            footer: 'Nexus Neural Bridge | SEQ-REMIND-SET'
        });

        await interaction.reply({ embeds: [embed], flags: 64 });

        setTimeout(async () => {
            try {
                const reminderEmbed = createEmbed({
                    title: '🔔 Neural Link Triggered',
                    description: `\`[URGENT]\` Archived memory trace recovered: \n**${reason}**`,
                    color: '#00FFCC',
                    footer: 'Nexus Neural Bridge | SEQ-REMIND-FIN'
                });

                await interaction.user.send({ embeds: [reminderEmbed] });
            } catch (error) {
                console.warn(`Could not send DM to ${interaction.user.tag} for reminder.`);
            }
        }, ms);
    },
};
