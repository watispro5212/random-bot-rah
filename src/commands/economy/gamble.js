const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your credits on a dice roll — double or nothing!')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of credits to gamble.')
                .setRequired(true)
                .setMinValue(100)),
    cooldown: 10,
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userData = await User.findOne({ userId, guildId });
        if (!userData) {
            userData = new User({ userId, guildId });
        }

        if (userData.balance < amount) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Insufficient Funds',
                    description: `You only have \`$${userData.balance.toLocaleString()}\` in your wallet.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        // Roll two dice
        const playerRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        const houseRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;

        const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        const playerDice1 = Math.floor(Math.random() * 6) + 1;
        const playerDice2 = playerRoll - playerDice1;
        const houseDice1 = Math.floor(Math.random() * 6) + 1;
        const houseDice2 = houseRoll - houseDice1;

        const won = playerRoll > houseRoll;
        const tie = playerRoll === houseRoll;

        let result, change, color;

        if (tie) {
            result = "🤝 **Push!** It's a tie — your bet is returned.";
            change = 0;
            color = '#F1C40F';
        } else if (won) {
            const winnings = Math.floor(amount * 1.8); // 1.8x payout
            result = `🎉 **You win!** +\`$${winnings.toLocaleString()}\``;
            change = winnings;
            color = '#2ECC71';
        } else {
            result = `💀 **House wins!** -\`$${amount.toLocaleString()}\``;
            change = -amount;
            color = '#ED4245';
        }

        userData.balance += change;
        if (change > 0) userData.totalEarned = (userData.totalEarned || 0) + change;
        await userData.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🎲 Dice Gamble',
                description: [
                    `**Your Roll:** \`${playerRoll}\` 🎲`,
                    `**House Roll:** \`${houseRoll}\` 🎲`,
                    '',
                    result,
                    `**New Balance:** \`$${userData.balance.toLocaleString()}\``
                ].join('\n'),
                color,
                footer: `Nexus v12.0.0 • Bet: $${amount.toLocaleString()}`
            })]
        });
    },
};
