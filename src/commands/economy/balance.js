const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your current wallet and bank balance.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check the balance of.')
                .setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target') || interaction.user;

        // Find or create user data
        let userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        
        if (!userData) {
            userData = new User({
                userId: target.id,
                guildId: interaction.guild.id
            });
            await userData.save();
        }

        const balanceEmbed = embedBuilder({
            title: `${target.username}'s Economic Status`,
            description: `**Wallet:** $${userData.balance}\n**Bank:** $${userData.bank}\n**Total:** $${userData.balance + userData.bank}`,
            color: '#2ECC71',
            thumbnail: target.displayAvatarURL({ dynamic: true })
        });

        await interaction.reply({ embeds: [balanceEmbed] });
    },
};
