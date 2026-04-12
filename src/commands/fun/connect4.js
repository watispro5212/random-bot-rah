const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const COLS = 7;
const ROWS = 6;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect4')
        .setDescription('Challenge another user to a game of Connect 4!')
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('The user to challenge.')
                .setRequired(true)),
    cooldown: 15,
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');

        if (opponent.bot) {
            return interaction.reply({ content: '❌ You cannot challenge a bot.', flags: [MessageFlags.Ephemeral] });
        }
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: '❌ You cannot challenge yourself.', flags: [MessageFlags.Ephemeral] });
        }

        // Initialize empty board
        const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        const players = [interaction.user, opponent];
        const pieces = ['🔴', '🟡'];
        let currentPlayer = 0;
        let gameOver = false;

        const renderBoard = () => {
            let display = '';
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] === 1) display += '🔴';
                    else if (board[r][c] === 2) display += '🟡';
                    else display += '⚫';
                }
                display += '\n';
            }
            display += '1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣';
            return display;
        };

        const checkWin = (player) => {
            const p = player + 1;
            // Horizontal
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c <= COLS - 4; c++) {
                    if (board[r][c] === p && board[r][c+1] === p && board[r][c+2] === p && board[r][c+3] === p) return true;
                }
            }
            // Vertical
            for (let r = 0; r <= ROWS - 4; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] === p && board[r+1][c] === p && board[r+2][c] === p && board[r+3][c] === p) return true;
                }
            }
            // Diagonal (down-right)
            for (let r = 0; r <= ROWS - 4; r++) {
                for (let c = 0; c <= COLS - 4; c++) {
                    if (board[r][c] === p && board[r+1][c+1] === p && board[r+2][c+2] === p && board[r+3][c+3] === p) return true;
                }
            }
            // Diagonal (down-left)
            for (let r = 0; r <= ROWS - 4; r++) {
                for (let c = 3; c < COLS; c++) {
                    if (board[r][c] === p && board[r+1][c-1] === p && board[r+2][c-2] === p && board[r+3][c-3] === p) return true;
                }
            }
            return false;
        };

        const isBoardFull = () => board[0].every(cell => cell !== 0);

        const buildButtons = () => {
            const row1 = new ActionRowBuilder();
            const row2 = new ActionRowBuilder();

            for (let c = 0; c < 4; c++) {
                row1.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`c4_${c}`)
                        .setLabel(`${c + 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(gameOver || board[0][c] !== 0)
                );
            }
            for (let c = 4; c < COLS; c++) {
                row2.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`c4_${c}`)
                        .setLabel(`${c + 1}`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(gameOver || board[0][c] !== 0)
                );
            }

            return [row1, row2];
        };

        const buildEmbed = (statusText) => {
            return embedBuilder({
                title: '🔴🟡 Connect 4',
                description: `${renderBoard()}\n\n${statusText}`,
                color: currentPlayer === 0 ? '#ED4245' : '#F1C40F'
            });
        };

        const statusText = `${pieces[currentPlayer]} ${players[currentPlayer]}'s turn`;

        const msg = await interaction.reply({
            embeds: [buildEmbed(statusText)],
            components: buildButtons(),
            fetchReply: true
        });

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000 // 5 minutes
        });

        collector.on('collect', async (btn) => {
            if (btn.user.id !== players[currentPlayer].id) {
                return btn.reply({ content: `❌ It's not your turn!`, flags: [MessageFlags.Ephemeral] });
            }

            const col = parseInt(btn.customId.split('_')[1]);

            // Drop piece
            let placed = false;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r][col] === 0) {
                    board[r][col] = currentPlayer + 1;
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                return btn.reply({ content: '❌ That column is full!', flags: [MessageFlags.Ephemeral] });
            }

            // Check win
            if (checkWin(currentPlayer)) {
                gameOver = true;
                const winText = `🎉 ${pieces[currentPlayer]} **${players[currentPlayer].username}** wins!`;
                await btn.update({
                    embeds: [buildEmbed(winText)],
                    components: []
                });
                collector.stop();
                return;
            }

            // Check draw
            if (isBoardFull()) {
                gameOver = true;
                await btn.update({
                    embeds: [buildEmbed('🤝 **It\'s a draw!**')],
                    components: []
                });
                collector.stop();
                return;
            }

            // Switch turns
            currentPlayer = currentPlayer === 0 ? 1 : 0;
            const nextStatus = `${pieces[currentPlayer]} ${players[currentPlayer]}'s turn`;

            await btn.update({
                embeds: [buildEmbed(nextStatus)],
                components: buildButtons()
            });
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time' && !gameOver) {
                msg.edit({
                    embeds: [buildEmbed('⏰ **Game timed out!**')],
                    components: []
                }).catch(() => {});
            }
        });
    },
};
