const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const hackStages = [
    '`[▓░░░░░░░░░]` 10% — Bypassing firewall...',
    '`[▓▓▓░░░░░░░]` 30% — Injecting payload...',
    '`[▓▓▓▓▓░░░░░]` 50% — Extracting credentials...',
    '`[▓▓▓▓▓▓▓░░░]` 70% — Decrypting mainframe...',
    '`[▓▓▓▓▓▓▓▓▓░]` 90% — Covering tracks...',
    '`[▓▓▓▓▓▓▓▓▓▓]` 100% — ACCESS GRANTED ✅',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Fake hack a user (just for fun!).')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to "hack".')
                .setRequired(true)),
    cooldown: 15,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');

        if (target.id === client.user.id) {
            return interaction.reply({
                content: '`[ACCESS DENIED]` Nice try, but you can\'t hack me. 😎',
                ephemeral: true
            });
        }

        await interaction.reply({
            embeds: [embedBuilder({
                title: `💻 Hacking ${target.displayName}...`,
                description: hackStages[0],
                color: '#00FF00'
            })]
        });

        for (let i = 1; i < hackStages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await interaction.editReply({
                embeds: [embedBuilder({
                    title: `💻 Hacking ${target.displayName}...`,
                    description: hackStages.slice(0, i + 1).join('\n'),
                    color: i === hackStages.length - 1 ? '#2ECC71' : '#00FF00'
                })]
            });
        }

        // Generate fake "stolen" data
        const fakeData = [
            `📧 Email: \`${target.username.toLowerCase()}@nexus-protocol.net\``,
            `🔑 Password: \`${'*'.repeat(Math.floor(Math.random() * 8) + 6)}\``,
            `💰 Bank Balance: \`$${(Math.floor(Math.random() * 999999) + 1000).toLocaleString()}\``,
            `📱 Last IP: \`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}\``,
            `🍕 Most Ordered: \`${['Pizza', 'Sushi', 'Tacos', 'Ramen', 'Burgers'][Math.floor(Math.random() * 5)]}\``,
        ];

        await new Promise(resolve => setTimeout(resolve, 1000));
        await interaction.editReply({
            embeds: [embedBuilder({
                title: `✅ ${target.displayName} — Hacked!`,
                description: `**Extracted Data:**\n${fakeData.join('\n')}\n\n*This is fake and just for fun!* 😄`,
                color: '#2ECC71'
            })]
        });
    },
};
