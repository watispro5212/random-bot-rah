const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to steal credits from another user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to rob.')
                .setRequired(true)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You can\'t rob yourself.', flags: [MessageFlags.Ephemeral] });
        }
        if (target.bot) {
            return interaction.reply({ content: '❌ You can\'t rob bots.', flags: [MessageFlags.Ephemeral] });
        }

        let robber = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!robber) robber = new User({ userId: interaction.user.id, guildId: interaction.guild.id });

        let victim = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!victim) victim = new User({ userId: target.id, guildId: interaction.guild.id });

        
        const cooldown = 2 * 60 * 60 * 1000;
        if (robber.lastRob && (Date.now() - robber.lastRob < cooldown)) {
            const timeLeft = cooldown - (Date.now() - robber.lastRob);
            const mins = Math.floor(timeLeft / 60000);
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '⏳ Too Hot',
                    description: `You need to lay low. Try again in \`${mins}m\`.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        
        if (victim.inventory && victim.inventory.includes('shield')) {
            robber.lastRob = new Date();
            await robber.save();
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '🛡️ Blocked!',
                    description: `${target.displayName} has a **Shield Module** equipped. Your robbery was deflected!`,
                    color: '#ED4245'
                })]
            });
        }

        if (victim.balance < 100) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '💸 Not Worth It',
                    description: `${target.displayName} has less than \`$100\` in their wallet. Find a richer target.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        
        const success = Math.random() < 0.5;
        robber.lastRob = new Date();

        if (success) {
            const stealPercent = Math.random() * 0.3 + 0.1; 
            const stolen = Math.floor(victim.balance * stealPercent);

            robber.balance += stolen;
            robber.totalEarned = (robber.totalEarned || 0) + stolen;
            victim.balance -= stolen;

            await robber.save();
            await victim.save();

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '💰 Robbery Successful!',
                    description: `You stole **$${stolen.toLocaleString()}** from ${target.displayName}!\n**Your Balance:** \`$${robber.balance.toLocaleString()}\``,
                    color: '#2ECC71'
                })]
            });
        } else {
            const fine = Math.floor(Math.random() * 500) + 200;
            robber.balance = Math.max(0, robber.balance - fine);
            await robber.save();

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🚨 Caught!',
                    description: `You were caught trying to rob ${target.displayName}!\n**Fine:** \`$${fine.toLocaleString()}\`\n**Your Balance:** \`$${robber.balance.toLocaleString()}\``,
                    color: '#ED4245'
                })]
            });
        }
    },
};
