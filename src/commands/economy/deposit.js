const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Move credits from your wallet into your bank.')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('Amount to deposit (number or "all").')
                .setRequired(true)),
    cooldown: 5,
    async execute(interaction, client) {
        let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!userData) {
            userData = new User({ userId: interaction.user.id, guildId: interaction.guild.id });
        }

        const input = interaction.options.getString('amount').toLowerCase();
        let amount;

        if (input === 'all') {
            amount = userData.balance;
        } else {
            amount = parseInt(input);
        }

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply({ content: '❌ Enter a valid positive number or "all".', flags: [MessageFlags.Ephemeral] });
        }

        if (amount > userData.balance) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Insufficient Funds',
                    description: `You only have \`$${userData.balance.toLocaleString()}\` in your wallet.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        userData.balance -= amount;
        userData.bank += amount;
        await userData.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🏦 Deposit Successful',
                description: `**Deposited:** \`$${amount.toLocaleString()}\`\n**Wallet:** \`$${userData.balance.toLocaleString()}\`\n**Bank:** \`$${userData.bank.toLocaleString()}\``,
                color: '#2ECC71'
            })]
        });
    },
};
