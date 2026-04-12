const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfer credits to another user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to pay.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to transfer.')
                .setRequired(true)
                .setMinValue(1)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You can\'t pay yourself.', flags: [MessageFlags.Ephemeral] });
        }
        if (target.bot) {
            return interaction.reply({ content: '❌ You can\'t pay bots.', flags: [MessageFlags.Ephemeral] });
        }

        let sender = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!sender) sender = new User({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (sender.balance < amount) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Insufficient Funds',
                    description: `You only have \`$${sender.balance.toLocaleString()}\` in your wallet.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        let receiver = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!receiver) receiver = new User({ userId: target.id, guildId: interaction.guild.id });

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: '💸 Transfer Complete',
                description: `**From:** ${interaction.user.tag}\n**To:** ${target.tag}\n**Amount:** \`$${amount.toLocaleString()}\``,
                fields: [
                    { name: 'Your Balance', value: `\`$${sender.balance.toLocaleString()}\``, inline: true },
                    { name: `${target.displayName}'s Balance`, value: `\`$${receiver.balance.toLocaleString()}\``, inline: true },
                ],
                color: '#2ECC71'
            })]
        });
    },
};
