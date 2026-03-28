const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');
const EconomyManager = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-credits')
        .setDescription('Override an operative\'s credit reserves. (Owner Only)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The operative to modify.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Wallet or Bank')
                .setRequired(true)
                .addChoices(
                    { name: 'Wallet', value: 'wallet' },
                    { name: 'Bank', value: 'bank' }
                ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount to set.')
                .setRequired(true)),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const target = interaction.options.getUser('target');
        const type = interaction.options.getString('type');
        const amount = interaction.options.getInteger('amount');

        const userData = await EconomyManager.getUser(target.id, interaction.guild.id);
        if (!userData) {
            return interaction.reply({ content: '`[ERROR]` Could not load user economy record.', flags: 64 });
        }
        const oldAmount = userData[type];
        userData[type] = amount;
        await userData.save();

        const embed = createEmbed({
            title: '💰 Credit Override Executed',
            description: `**Target:** ${target.tag} (${target.id})\n**Field:** \`${type.toUpperCase()}\`\n**Previous:** ₵${oldAmount.toLocaleString()}\n**New Value:** ₵${amount.toLocaleString()}`,
            color: '#FFB800',
            footer: `Override by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed], flags: 64 });
    },
};
