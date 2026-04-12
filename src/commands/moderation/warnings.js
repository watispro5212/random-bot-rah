const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const Warning = require('../../models/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View all warnings for a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to check.')
                .setRequired(true)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        const warnings = await Warning.find({
            userId: target.id,
            guildId: interaction.guild.id
        }).sort({ createdAt: -1 });

        if (warnings.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '✅ No Warnings',
                    description: `\`${target.tag}\` has a clean record.`,
                    color: '#2ECC71'
                })]
            });
        }

        const activeCount = warnings.filter(w => w.active !== false).length;

        const fields = warnings.slice(0, 15).map((w, i) => ({
            name: `${w.active !== false ? '⚠️' : '☑️'} Warning #${i + 1}`,
            value: `**Reason:** ${w.reason}\n**Admin:** <@${w.adminId}>\n**Date:** <t:${Math.floor(w.createdAt / 1000)}:R>`,
            inline: true
        }));

        await interaction.reply({
            embeds: [embedBuilder({
                title: `📋 Warnings — ${target.tag}`,
                description: `**Total:** \`${warnings.length}\` | **Active:** \`${activeCount}\``,
                fields,
                color: '#F1C40F',
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })],
            flags: [MessageFlags.Ephemeral]
        });
    },
};
