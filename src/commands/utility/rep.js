const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Give a reputation point to another user.')
        .addUserOption(opt => opt.setName('user').setDescription('The user to give rep to').setRequired(true)),
    cooldown: 10,
    async execute(interaction) {
        const target = interaction.options.getUser('user');

        if (target.id === interaction.user.id) {
            return interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Invalid Target', description: 'You cannot give reputation to yourself.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        if (target.bot) {
            return interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Invalid Target', description: 'You cannot give reputation to a bot.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        try {
            const giver = await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { $setOnInsert: { userId: interaction.user.id, guildId: interaction.guild.id } },
                { upsert: true, new: true }
            );

            const cooldownMs = 24 * 60 * 60 * 1000;
            if (giver.lastRepGiven && (Date.now() - giver.lastRepGiven.getTime()) < cooldownMs) {
                const timeLeft = cooldownMs - (Date.now() - giver.lastRepGiven.getTime());
                const hours = Math.floor(timeLeft / 3600000);
                const minutes = Math.floor((timeLeft % 3600000) / 60000);
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '⏳ Cooldown Active',
                        description: `You can give reputation again in **${hours}h ${minutes}m**.`,
                        color: '#F1C40F'
                    })],
                    flags: [MessageFlags.Ephemeral]
                });
            }

            await User.findOneAndUpdate(
                { userId: target.id, guildId: interaction.guild.id },
                { $inc: { reputation: 1 }, $setOnInsert: { userId: target.id, guildId: interaction.guild.id } },
                { upsert: true }
            );

            giver.lastRepGiven = new Date();
            await giver.save();

            const targetData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '⭐ Reputation Given',
                    description: `You gave **+1 rep** to ${target}!\nThey now have **${targetData?.reputation || 1}** reputation.`,
                    color: '#00FF88'
                })]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Error', description: 'Failed to update reputation. Database may be unavailable.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
