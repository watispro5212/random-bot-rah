const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Display a user\'s profile banner.')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('The user to fetch the banner for.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('user') || interaction.user;
        const fetched = await target.fetch({ force: true });
        const bannerURL = fetched.bannerURL({ size: 4096, dynamic: true });

        if (!bannerURL) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '🖼️ No Banner Found',
                    description: `**${target.username}** does not have a profile banner set.`,
                    color: '#FF4444'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        await interaction.reply({
            embeds: [embedBuilder({
                title: `🖼️ ${target.username}'s Banner`,
                image: bannerURL
            })]
        });
    },
};
