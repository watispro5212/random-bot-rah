const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('audit')
        .setDescription('Review recent warnings and security logs for a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to audit.')
                .setRequired(true)),
    cooldown: 10,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        const totalCount = await Warning.countDocuments({ userId: target.id, guildId: interaction.guild.id });
        const warnings = await Warning.find({
            userId: target.id,
            guildId: interaction.guild.id
        }).sort({ createdAt: -1 }).limit(10);

        if (warnings.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '✅ Breach Audit — Clean',
                    description: `No security infractions found for \`${target.tag}\`.`,
                    color: '#2ECC71'
                })]
            });
        }

        const fields = warnings.map((w, i) => ({
            name: `#${i + 1} — ${w._id.toString().slice(-6).toUpperCase()}`,
            value: `**Reason:** ${w.reason}\n**Date:** <t:${Math.floor(w.createdAt / 1000)}:R>\n**Active:** ${w.active !== false ? '✅' : '❌'}`,
            inline: true
        }));

        await interaction.reply({
            embeds: [embedBuilder({
                title: `🔍 Breach Audit — ${target.tag}`,
                description: `**Total Infractions:** \`${totalCount}\`\nShowing the latest \`${warnings.length}\`.`,
                fields,
                color: '#F1C40F',
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })]
        });
    },
};
