const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Safely transfer credits to another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to send credits to')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount of credits to send')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');
        const senderId = interaction.user.id;
        const targetId = targetUser.id;

        if (targetUser.bot) {
            return interaction.reply({ 
                content: 'You cannot send credits to a bot!', 
                flags: 64 
            });
        }
        
        if (targetId === senderId) {
            return interaction.reply({ 
                content: 'You cannot send credits to yourself!', 
                flags: 64 
            });
        }

        const senderData = await economy.getUser(senderId, interaction.guild.id);
        if (!senderData) {
            return interaction.reply({ content: '`[ERROR]` Could not load your economy profile.', flags: 64 });
        }

        if (senderData.wallet < amount) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Funds',
                    description: `You only have **${senderData.wallet.toLocaleString()} Credits** in your wallet.`,
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        const targetData = await economy.getUser(targetId, interaction.guild.id);
        if (!targetData) {
            return interaction.reply({ content: '`[ERROR]` Could not load recipient economy profile.', flags: 64 });
        }

        // Perform the transfer
        senderData.wallet -= amount;
        targetData.wallet += amount;

        await economy.saveUser(senderData);
        await economy.saveUser(targetData);

        const embed = createEmbed({
            title: '💸 Transfer Successful',
            description: `You successfully sent **${amount.toLocaleString()} Credits** to <@${targetId}>.`,
            fields: [
                { name: 'Your New Balance', value: `${senderData.wallet.toLocaleString()}`, inline: true },
                { name: 'Their New Balance', value: `${targetData.wallet.toLocaleString()}`, inline: true }
            ],
            color: 0x57F287
        });

        await interaction.reply({ embeds: [embed] });
    },
};
