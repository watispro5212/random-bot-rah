const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Airdrop resources to the community.')
        .addStringOption(option => 
            option.setName('prize')
                .setDescription('The item being dropped.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('Duration (e.g., 10s, 5m, 1h).')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('winners')
                .setDescription('Number of recipients (default 1).')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const durationStr = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners') || 1;

        const timeMatch = durationStr.match(/^(\d+)([smhd])$/);
        if (!timeMatch) {
            return interaction.reply({ content: 'Invalid time format. Try something like `10s`, `5m`, `1h`, `1d`.', flags: 64 });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2];

        let ms = 0;
        if (unit === 's') ms = value * 1000;
        else if (unit === 'm') ms = value * 60 * 1000;
        else if (unit === 'h') ms = value * 60 * 60 * 1000;
        else if (unit === 'd') ms = value * 24 * 60 * 60 * 1000;

        if (ms > 7 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'Maximum drop duration is 7 days.', flags: 64 });
        }

        const endsAt = Math.floor((Date.now() + ms) / 1000);

        const embed = createEmbed({
            title: `🎉 Resource Airdrop: ${prize}`,
            description: `React with 🎉 to enter!\nEnds: <t:${endsAt}:R>\nWinners: **${winnerCount}**`,
            color: '#00FFCC',
            footer: 'Nexus Rewards System'
        });

        const message = await interaction.reply({ embeds: [embed], withResponse: true });
        await message.react('🎉');

        setTimeout(async () => {
            try {
                // Fetch the latest version of the message to get accurate reactions
                const fetchedMsg = await interaction.channel.messages.fetch(message.id);
                const reaction = fetchedMsg.reactions.cache.get('🎉');
                
                // Exclude the bot from the count
                const users = await reaction.users.fetch();
                const validUsers = users.filter(u => !u.bot).map(u => u);

                if (validUsers.length === 0) {
                    return interaction.followUp({ content: `The airdrop for **${prize}** has ended. No participation detected.` });
                }

                // Randomly select winners
                const winners = [];
                const actualWinnerCount = Math.min(winnerCount, validUsers.length);
                
                for (let i = 0; i < actualWinnerCount; i++) {
                    const randomIndex = Math.floor(Math.random() * validUsers.length);
                    winners.push(validUsers[randomIndex]);
                    validUsers.splice(randomIndex, 1); // remove so they aren't picked twice
                }

                const winnerMentions = winners.map(w => `<@${w.id}>`).join(', ');

                const endEmbed = createEmbed({
                    title: `🎉 Airdrop Closed: ${prize}`,
                    description: `Transmitting rewards to: ${winnerMentions}`,
                    color: '#00FFCC',
                    footer: 'Nexus Rewards System'
                });

                await interaction.followUp({ content: winnerMentions, embeds: [endEmbed] });
            } catch (error) {
                console.error('Giveaway error:', error);
            }
        }, ms);
    },
};
