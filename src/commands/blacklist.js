const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Block an operative from using the Nexus. (Owner Only)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The operative to blacklist.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the blacklist.')
                .setRequired(false)),
    ownerOnly: true,
    async execute(interaction, client) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason specified.';

        if (interaction.client.blacklist.has(target.id)) {
            // Remove from blacklist (toggle)
            interaction.client.blacklist.delete(target.id);

            const embed = createEmbed({
                title: '🟢 Operative Un-Blacklisted',
                description: `**${target.tag}** (${target.id}) has been restored to the Nexus.`,
                color: '#00FF88',
                footer: `Action by ${interaction.user.tag}`
            });

            return interaction.reply({ embeds: [embed], flags: 64 });
        }

        interaction.client.blacklist.add(target.id);

        const embed = createEmbed({
            title: '🔴 Operative Blacklisted',
            description: `**${target.tag}** (${target.id}) has been severed from the Nexus.\n\n**Reason:** ${reason}`,
            color: '#FF0000',
            footer: `Action by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed], flags: 64 });
    },
};
