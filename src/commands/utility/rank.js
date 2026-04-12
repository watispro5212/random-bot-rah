const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Check your or another user\'s current level and XP.')
        .addUserOption(opt => opt.setName('user').setDescription('The user to check').setRequired(false)),
    cooldown: 5,
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;

        if (target.bot) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '🤖 Bot Profiles',
                    description: 'Bots are part of the Singularity engine and do not require mortal XP tracking.',
                    color: '#FFB700'
                })]
            });
        }

        try {
            const userProfile = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
            
            if (!userProfile) {
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '📉 No Data',
                        description: `**${target.username}** has not accumulated any XP yet. Start chatting to begin!`,
                        color: '#A0A5B5'
                    })]
                });
            }

            // Calculate next level requirement
            const currentLevel = userProfile.level;
            const currentXP = userProfile.xp;
            const xpNeeded = 5 * (currentLevel ** 2) + 50 * currentLevel + 100;
            const percentage = Math.min(100, Math.floor((currentXP / xpNeeded) * 100));

            // Generate ASCII progress bar
            const fl = Math.floor(percentage / 10);
            const bar = '▓'.repeat(fl) + '░'.repeat(10 - fl);

            // Fetch rank position across guild
            const allUsers = await User.find({ guildId: interaction.guild.id }).sort({ level: -1, xp: -1 }).select('userId').lean();
            const rankPosition = allUsers.findIndex(u => u.userId === target.id) + 1;

            const rankText = rankPosition === 1 ? '👑 #1 (Server Leader)' : `#${rankPosition}`;

            await interaction.reply({
                embeds: [embedBuilder({
                    title: `🌟 Rank Card: ${target.username}`,
                    description: `**Global Rank:** ${rankText}`,
                    fields: [
                        { name: 'Level', value: `\`${currentLevel}\``, inline: true },
                        { name: 'Current XP', value: `\`${currentXP.toLocaleString()} / ${xpNeeded.toLocaleString()}\``, inline: true },
                        { name: 'Progress', value: `**${percentage}%** \`[${bar}]\`\n${xpNeeded - currentXP} XP until Level ${currentLevel + 1}` }
                    ],
                    thumbnail: target.displayAvatarURL({ dynamic: true, size: 256 }),
                    color: userProfile.profileColor || '#FFB700'
                })]
            });
        } catch (err) {
            console.error('[RANK ERROR]', err);
            interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Database Error', description: 'Failed to access user rank data.', color: '#FF4444' })],
                flags: [2n] // Ephemeral flag workaround
            }).catch(() => {});
        }
    }
};
