const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');
const EconomyManager = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-level')
        .setDescription('Override an operative\'s neural level. (Owner Only)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The operative to modify.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The level to set.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1000))
        .addIntegerOption(option =>
            option.setName('xp')
                .setDescription('The XP to set (optional, defaults to 0).')
                .setRequired(false)),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const target = interaction.options.getUser('target');
        const level = interaction.options.getInteger('level');
        const xp = interaction.options.getInteger('xp') ?? 0;

        const userData = await EconomyManager.getUser(target.id);
        const oldLevel = userData.level;
        const oldXp = userData.xp;
        userData.level = level;
        userData.xp = xp;
        await userData.save();

        const embed = createEmbed({
            title: '🧬 Neural Level Override',
            description: `**Target:** ${target.tag} (${target.id})\n\n**Level:** ${oldLevel} → **${level}**\n**XP:** ${oldXp} → **${xp}**`,
            color: '#BC13FE',
            footer: `Override by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed], flags: 64 });
    },
};
