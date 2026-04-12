const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Mass delete messages in the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Only delete messages from this user.')
                .setRequired(false)),
    cooldown: 10,
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');
        const targetUser = interaction.options.getUser('target');

        try {
            let deleted;

            if (targetUser) {
                
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const userMessages = messages
                    .filter(m => m.author.id === targetUser.id)
                    .first(amount);
                deleted = await interaction.channel.bulkDelete(userMessages, true);
            } else {
                deleted = await interaction.channel.bulkDelete(amount, true);
            }

            const description = targetUser
                ? `Purged \`${deleted.size}\` messages from ${targetUser.tag}.`
                : `Purged \`${deleted.size}\` messages.`;

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🗑️ Purge Complete',
                    description: `${description}\n**Requested:** \`${amount}\`\n**Moderator:** ${interaction.user.tag}`,
                    color: '#2ECC71'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Purge Failed',
                    description: 'Messages older than 14 days cannot be bulk deleted.',
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
