const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Scan current credit reserves.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('Scan another user\'s reserves')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        if (target.bot) {
            return interaction.reply({ content: 'Scanning failed. Artificial constructs do not possess currency.', flags: 64 });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        const netWorth = data.wallet + data.bank;

        const embed = createEmbed({
            title: `💳 Nexus Account: ${target.username}`,
            thumbnail: target.displayAvatarURL(),
            fields: [
                { name: '👛 Local Wallet', value: `\`${data.wallet.toLocaleString()} Credits\``, inline: true },
                { name: '🏦 Nexus Vault', value: `\`${data.bank.toLocaleString()} / ${data.bankCapacity.toLocaleString()} Credits\``, inline: true },
                { name: '🌐 Total Net Worth', value: `\`${netWorth.toLocaleString()} Credits\``, inline: false },
            ],
            color: '#00FFCC'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
