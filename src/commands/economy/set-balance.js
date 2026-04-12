const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User'); 

module.exports = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-balance')
        .setDescription('Directly modify a user\'s balance.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to modify.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The new balance.')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        try {
            await User.findOneAndUpdate(
                { userId: target.id },
                { $set: { balance: amount } },
                { upsert: true }
            );

            const economyEmbed = embedBuilder({
                title: 'Balance Updated',
                description: `**User:** ${target.tag}\n**New Total:** $${amount.toLocaleString()}`,
                color: '#00FF88'
            });

            await interaction.reply({ embeds: [economyEmbed] });
        } catch (error) {
            console.error('Set-credits error:', error);
            await interaction.reply({ content: 'Failed to modify global economy registry.', flags: [MessageFlags.Ephemeral] });
        }
    },
};
