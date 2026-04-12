const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create a custom embed message.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The embed title.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The embed description.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hex color code (e.g. #FF0000).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Image URL to display.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('Thumbnail URL.')
                .setRequired(false)),
    cooldown: 10,
    async execute(interaction, client) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || '#5865F2';
        const image = interaction.options.getString('image');
        const thumbnail = interaction.options.getString('thumbnail');

        
        const colorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!colorRegex.test(color)) {
            return interaction.reply({
                content: '❌ Invalid hex color. Use format like `#FF0000`.',
                flags: [MessageFlags.Ephemeral]
            });
        }

        const customEmbed = embedBuilder({
            title,
            description: description.replace(/\\n/g, '\n'),
            color,
            image,
            thumbnail,
            footer: `Created by ${interaction.user.tag}`
        });

        await interaction.channel.send({ embeds: [customEmbed] });
        await interaction.reply({ content: '✅ Embed sent!', flags: [MessageFlags.Ephemeral] });
    },
};
