const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Calculate the romantic compatibility between two users.')
        .addUserOption(opt => opt.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption(opt => opt.setName('user2').setDescription('Second user (opt, defaults to you)').setRequired(false)),
    cooldown: 5,
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2') || interaction.user;

        if (user1.id === user2.id) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '💖 Self-Love',
                    description: `You are 100% compatible with yourself, ${user1.username}! Always love yourself first.`,
                    color: '#FF69B4'
                })]
            });
        }

        // Generate a pseudo-random stable percentage based on their IDs so it's always the same for the pair
        const combinedId = [user1.id, user2.id].sort().join('');
        const hash = Array.from(combinedId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const percentage = hash % 101; 

        // Generate ASCII bar
        const fl = Math.floor(percentage / 10);
        const em = 10 - fl;
        const bar = '▓'.repeat(fl) + '░'.repeat(em);

        let comment = '';
        if (percentage < 20) comment = 'Yikes... Maybe stay friends.';
        else if (percentage < 40) comment = 'There is a tiny spark, but it will take work.';
        else if (percentage < 60) comment = 'A solid 50/50. Could go either way!';
        else if (percentage < 80) comment = 'Ooh, looking good! Give it a shot!';
        else if (percentage < 95) comment = 'A match made in heaven! 💕';
        else comment = 'PERFECT SOULMATES! 💖🔥💍';

        await interaction.reply({
            embeds: [embedBuilder({
                title: '💘 Matchmaking Calculation 💘',
                description: `**${user1.username}** x **${user2.username}**\n\n**${percentage}%** \`[${bar}]\`\n\n*${comment}*`,
                color: '#FF1493',
                thumbnail: 'https://i.imgur.com/E8W8yXw.png'
            })]
        });
    }
};
