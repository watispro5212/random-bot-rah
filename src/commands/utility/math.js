const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

/**
 * Safe math evaluator — no eval().
 * Supports: +, -, *, /, **, %, parentheses, decimals, negation.
 */
function safeMathEval(expr) {
    const tokens = expr.match(/(\d+\.?\d*|\+|-|\*\*|\*|\/|%|\(|\))/g);
    if (!tokens) throw new Error('Invalid expression');

    let pos = 0;

    function parseExpr() {
        let result = parseTerm();
        while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
            const op = tokens[pos++];
            const right = parseTerm();
            result = op === '+' ? result + right : result - right;
        }
        return result;
    }

    function parseTerm() {
        let result = parsePower();
        while (pos < tokens.length && (tokens[pos] === '*' && tokens[pos] !== '**' || tokens[pos] === '/' || tokens[pos] === '%')) {
            const op = tokens[pos++];
            const right = parsePower();
            if (op === '*') result *= right;
            else if (op === '/') {
                if (right === 0) throw new Error('Division by zero');
                result /= right;
            }
            else result %= right;
        }
        return result;
    }

    function parsePower() {
        let result = parseFactor();
        while (pos < tokens.length && tokens[pos] === '**') {
            pos++;
            const right = parseFactor();
            result = Math.pow(result, right);
        }
        return result;
    }

    function parseFactor() {
        if (tokens[pos] === '-') {
            pos++;
            return -parseFactor();
        }
        if (tokens[pos] === '(') {
            pos++;
            const result = parseExpr();
            if (tokens[pos] !== ')') throw new Error('Missing closing parenthesis');
            pos++;
            return result;
        }
        const num = parseFloat(tokens[pos]);
        if (isNaN(num)) throw new Error(`Unexpected token: ${tokens[pos]}`);
        pos++;
        return num;
    }

    const result = parseExpr();
    if (pos < tokens.length) throw new Error('Unexpected tokens after expression');
    if (!isFinite(result)) throw new Error('Result is not a finite number');
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Safely evaluate a mathematical expression.')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('The math expression (e.g. 2 + 3 * 4, 10 ** 2, 15 % 4)')
                .setRequired(true)),
    cooldown: 3,
    async execute(interaction, client) {
        const expression = interaction.options.getString('expression');

        try {
            const result = safeMathEval(expression);

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🧮 Computation Engine',
                    description: `**Input:** \`${expression}\`\n**Output:** \`${result}\``,
                    color: '#5865F2'
                })]
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Computation Failure',
                    description: `The expression is malformed or invalid.\n**Error:** \`${err.message}\``,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    },
};
