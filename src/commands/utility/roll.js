const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll dice — supports any die format (d6, 2d20, etc).')
        .addStringOption(option =>
            option.setName('dice')
                .setDescription('Dice notation like d6, 2d20, 3d8 (default: d6).')
                .setRequired(false)),
    cooldown: 3,
    async execute(interaction, client) {
        const input = interaction.options.getString('dice') || 'd6';
        const match = input.toLowerCase().match(/^(\d*)d(\d+)$/);

        if (!match) {
            return interaction.reply({
                content: '❌ Invalid dice format. Use notation like `d6`, `2d20`, `3d8`.',
                flags: [MessageFlags.Ephemeral]
            });
        }

        const count = parseInt(match[1]) || 1;
        const sides = parseInt(match[2]);

        if (count < 1 || count > 20 || sides < 2 || sides > 1000) {
            return interaction.reply({
                content: '❌ Limits: 1-20 dice, 2-1000 sides.',
                flags: [MessageFlags.Ephemeral]
            });
        }

        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const total = rolls.reduce((a, b) => a + b, 0);

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🎲 Dice Roll',
                description: `**Dice:** \`${count}d${sides}\`\n**Rolls:** ${rolls.map(r => `\`${r}\``).join(' + ')}\n**Total:** \`${total}\``,
                color: '#9B59B6'
            })]
        });
    },
};
