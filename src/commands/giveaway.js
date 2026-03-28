const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { replyWithMessage } = require('../utils/replyMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Initiates a high-priority resource airdrop protocol for the community.')
        .addStringOption(option => 
            option.setName('prize')
                .setDescription('The resource package being dropped.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('Airdrop duration (e.g., 10s, 5m, 1h).')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('winners')
                .setDescription('Number of authorized recipients (default 1).')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false))
        ,
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const durationStr = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners') || 1;

        const timeMatch = durationStr.match(/^(\d+)([smhd])$/);
        if (!timeMatch) {
            return interaction.reply({ content: '\`[ERROR]\` Invalid temporal format. Use: 10s, 5m, 1h, 1d.', flags: 64 });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2];

        let ms = 0;
        if (unit === 's') ms = value * 1000;
        else if (unit === 'm') ms = value * 60 * 1000;
        else if (unit === 'h') ms = value * 60 * 60 * 1000;
        else if (unit === 'd') ms = value * 24 * 60 * 60 * 1000;

        if (ms > 7 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: '\`[LIMIT]\` Temporal window too wide. Max duration is 7 days.', flags: 64 });
        }

        const endsAt = Math.floor((Date.now() + ms) / 1000);

        const embed = createEmbed({
            title: `📦 High-Priority Airdrop: ${prize}`,
            description: `\`[TRANS-DROP INITIATED]\` \n\nInteract with 🎉 to authorize receipt!\n\n**Protocol Details:**\n🛰️ Ends: <t:${endsAt}:R>\n👥 Recipients: **${winnerCount}**`,
            color: '#00FFCC',
            footer: 'Nexus Logistics | AIRDROP-001'
        });

        const message = await replyWithMessage(interaction, {
            embeds: [embed],
        });
        await message.react('🎉');

        setTimeout(async () => {
            try {
                const fetchedMsg = await interaction.channel.messages.fetch(message.id);
                const reaction = fetchedMsg.reactions.cache.get('🎉');

                if (!reaction) {
                    return interaction.followUp({
                        content: `\`[ABORT]\` Airdrop for **${prize}** ended — could not read reactions.`,
                    });
                }

                const users = await reaction.users.fetch();
                const validUsers = users.filter(u => !u.bot).map(u => u);

                if (validUsers.length === 0) {
                    return interaction.followUp({ content: `\`[ABORT]\` Airdrop for **${prize}** failed. No valid recipients detected.` });
                }

                const winners = [];
                const actualWinnerCount = Math.min(winnerCount, validUsers.length);
                
                for (let i = 0; i < actualWinnerCount; i++) {
                    const randomIndex = Math.floor(Math.random() * validUsers.length);
                    winners.push(validUsers[randomIndex]);
                    validUsers.splice(randomIndex, 1);
                }

                const winnerMentions = winners.map(w => `<@${w.id}>`).join(', ');

                const endEmbed = createEmbed({
                    title: `📦 Airdrop Locked: ${prize}`,
                    description: `\`[DISTRIBUTION COMPLETE]\` \n\nResources successfully routed to: ${winnerMentions}`,
                    color: '#00FFCC',
                    footer: 'Nexus Logistics | DIST-SUCCESS'
                });

                await interaction.followUp({ content: `\`🚨 [RECIPIENTS FOUND]\`` + winnerMentions, embeds: [endEmbed] });
            } catch (error) {
                console.error('Giveaway error:', error);
            }
        }, ms);
    },
};
