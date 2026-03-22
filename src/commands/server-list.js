const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-list')
        .setDescription('Display all sectors running the Nexus Protocol. (Owner Only)'),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const guilds = interaction.client.guilds.cache;

        const serverList = guilds.map((g, i) =>
            `\`${g.memberCount.toString().padStart(5)}\` members — **${g.name}** (\`${g.id}\`)`
        ).join('\n');

        const totalMembers = guilds.reduce((sum, g) => sum + g.memberCount, 0);

        const description = serverList.length > 3800
            ? serverList.substring(0, 3800) + '\n...truncated'
            : serverList;

        const embed = createEmbed({
            title: '🌐 Nexus Sector Registry',
            description: `**${guilds.size}** active sectors | **${totalMembers.toLocaleString()}** total entities\n\n${description}`,
            color: '#00FFCC',
            footer: `Registry accessed by ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed], flags: 64 });
    },
};
