const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Emergency shutdown the Nexus core. (Owner Only)'),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const embed = createEmbed({
            title: '🔴 NEXUS SHUTDOWN INITIATED',
            description: '```diff\n- [CRITICAL] All shard processes terminating...\n- [CORE] Disconnecting from gateway...\n- [DB] Closing MongoDB connections...\n```\nThe Nexus Protocol will go offline in **3 seconds**.',
            color: '#FF0000',
            footer: `Authorized by Root Operative ${interaction.user.tag}`
        });

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => {
            process.exit(0);
        }, 3000);
    },
};
