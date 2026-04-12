const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Challenge another user to Tic-Tac-Toe!')
        .addUserOption(opt => opt.setName('opponent').setDescription('The user to challenge').setRequired(true)),
    cooldown: 15,
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');

        if (opponent.id === interaction.user.id) {
            return interaction.reply({ embeds: [embedBuilder({ title: '⚠️ Error', description: 'You cannot play against yourself!', color: '#FF4444' })], flags: [MessageFlags.Ephemeral] });
        }
        if (opponent.bot) {
            return interaction.reply({ embeds: [embedBuilder({ title: '⚠️ Error', description: 'You cannot play against a bot!', color: '#FF4444' })], flags: [MessageFlags.Ephemeral] });
        }

        const board = Array(9).fill(null);
        let currentPlayer = interaction.user.id;
        const players = { [interaction.user.id]: '❌', [opponent.id]: '⭕' };

        function buildBoard() {
            const rows = [];
            for (let r = 0; r < 3; r++) {
                const row = new ActionRowBuilder();
                for (let c = 0; c < 3; c++) {
                    const idx = r * 3 + c;
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ttt_${idx}`)
                            .setLabel(board[idx] || '⬜')
                            .setStyle(board[idx] === '❌' ? ButtonStyle.Danger : board[idx] === '⭕' ? ButtonStyle.Primary : ButtonStyle.Secondary)
                            .setDisabled(board[idx] !== null)
                    );
                }
                rows.push(row);
            }
            return rows;
        }

        function checkWin() {
            const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (const [a, b, c] of lines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
            }
            if (board.every(cell => cell !== null)) return 'draw';
            return null;
        }

        const embed = embedBuilder({
            title: '🎮 Tic-Tac-Toe',
            description: `${interaction.user} (❌) vs ${opponent} (⭕)\n\nCurrent turn: ${interaction.user} ❌`,
            color: '#7B2FFF'
        });

        await interaction.reply({ embeds: [embed], components: buildBoard() });
        const msg = await interaction.fetchReply();

        const collector = msg.createMessageComponentCollector({
            filter: i => [interaction.user.id, opponent.id].includes(i.user.id),
            time: 120000
        });

        collector.on('collect', async i => {
            if (i.user.id !== currentPlayer) {
                return i.reply({ content: 'It\'s not your turn!', flags: [MessageFlags.Ephemeral] });
            }

            const idx = parseInt(i.customId.split('_')[1]);
            if (board[idx] !== null) return i.reply({ content: 'That cell is taken!', flags: [MessageFlags.Ephemeral] });

            board[idx] = players[currentPlayer];
            const result = checkWin();

            if (result) {
                collector.stop();
                const disabledBoard = buildBoard().map(row => {
                    row.components.forEach(btn => btn.setDisabled(true));
                    return row;
                });

                const resultMsg = result === 'draw'
                    ? `It's a **draw**! 🤝`
                    : `${result === '❌' ? interaction.user : opponent} wins! 🎉`;

                await i.update({
                    embeds: [embedBuilder({ title: '🎮 Game Over!', description: resultMsg, color: result === 'draw' ? '#F1C40F' : '#00FF88' })],
                    components: disabledBoard
                });
            } else {
                currentPlayer = currentPlayer === interaction.user.id ? opponent.id : interaction.user.id;
                const turnUser = currentPlayer === interaction.user.id ? interaction.user : opponent;
                const turnSymbol = players[currentPlayer];

                await i.update({
                    embeds: [embedBuilder({
                        title: '🎮 Tic-Tac-Toe',
                        description: `${interaction.user} (❌) vs ${opponent} (⭕)\n\nCurrent turn: ${turnUser} ${turnSymbol}`,
                        color: '#7B2FFF'
                    })],
                    components: buildBoard()
                });
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                const disabledBoard = buildBoard().map(row => {
                    row.components.forEach(btn => btn.setDisabled(true));
                    return row;
                });
                await msg.edit({
                    embeds: [embedBuilder({ title: '🎮 Game Expired', description: 'The game timed out due to inactivity.', color: '#F1C40F' })],
                    components: disabledBoard
                }).catch(() => {});
            }
        });
    }
};
