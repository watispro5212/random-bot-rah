const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Initiates a high-fidelity biometric visual scan of a subject.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The subject to scan.')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = targetUser.displayAvatarURL({ dynamic: true, size: 2048 });

        const embed = createEmbed({
            title: `📸 Biometric Scan: ${targetUser.username}`,
            description: `\`[RESOLUTION: 2048px | FORMAT: DYNAMIC]\` \nScanning subject biometric data... **SUCCESS**`,
            image: avatarUrl,
            footer: `Subject ID: ${targetUser.id} | Scanned by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed] });
    },
};
