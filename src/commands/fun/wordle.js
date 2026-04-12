const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const WORDS = [
    'crane', 'plate', 'shine', 'brave', 'ghost', 'fluid', 'query', 'mixed',
    'vivid', 'ocean', 'power', 'flame', 'frost', 'steel', 'blade', 'storm',
    'guild', 'nexus', 'pixel', 'chain', 'drift', 'smash', 'pulse', 'clash',
    'theta', 'spark', 'crisp', 'ultra', 'prism', 'comet', 'forge', 'blaze',
    'spike', 'lunar', 'orbit', 'solar', 'vapor', 'grind', 'swift', 'reign',
    'vault', 'flora', 'stone', 'cloud', 'phase', 'surge', 'royal', 'prime',
    'crown', 'depth', 'sound', 'world', 'light', 'dream', 'night', 'mount'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wordle')
        .setDescription('Play a Wordle-style word guessing game!'),
    cooldown: 10,
    async execute(interaction) {
        const answer = WORDS[Math.floor(Math.random() * WORDS.length)];
        const maxAttempts = 6;
        const guesses = [];

        const buildBoard = () => {
            let board = '';
            for (const guess of guesses) {
                let row = '';
                for (let i = 0; i < 5; i++) {
                    if (guess[i] === answer[i]) {
                        row += '🟩';
                    } else if (answer.includes(guess[i])) {
                        row += '🟨';
                    } else {
                        row += '⬛';
                    }
                }
                row += ` \`${guess.toUpperCase()}\``;
                board += row + '\n';
            }

            // Empty rows
            for (let i = guesses.length; i < maxAttempts; i++) {
                board += '⬜⬜⬜⬜⬜\n';
            }

            return board;
        };

        const buildEmbed = (status = 'playing') => {
            let description = buildBoard();

            if (status === 'won') {
                description += `\n🎉 **You got it in ${guesses.length}/${maxAttempts}!**`;
            } else if (status === 'lost') {
                description += `\n💀 **Game Over!** The word was \`${answer.toUpperCase()}\``;
            } else {
                description += `\n📝 Type your 5-letter guess below! (${maxAttempts - guesses.length} attempts left)`;
            }

            return embedBuilder({
                title: '🟩 Nexus Wordle',
                description,
                color: status === 'won' ? '#2ECC71' : status === 'lost' ? '#ED4245' : '#FFD700',
                footer: `Nexus v12.0.0 • Attempt ${guesses.length}/${maxAttempts}`
            });
        };

        const msg = await interaction.reply({
            embeds: [buildEmbed()],
            fetchReply: true
        });

        const filter = m => m.author.id === interaction.user.id && m.content.length === 5 && /^[a-zA-Z]+$/.test(m.content);
        const collector = interaction.channel.createMessageCollector({
            filter,
            time: 180000, // 3 minutes
            max: maxAttempts
        });

        collector.on('collect', async (m) => {
            const guess = m.content.toLowerCase();
            guesses.push(guess);

            // Delete the guess message to keep things clean
            await m.delete().catch(() => {});

            if (guess === answer) {
                collector.stop('won');
                return;
            }

            if (guesses.length >= maxAttempts) {
                collector.stop('lost');
                return;
            }

            await msg.edit({ embeds: [buildEmbed()] }).catch(() => {});
        });

        collector.on('end', async (_, reason) => {
            const status = reason === 'won' ? 'won' : 'lost';
            await msg.edit({ embeds: [buildEmbed(status)] }).catch(() => {});
        });
    },
};
