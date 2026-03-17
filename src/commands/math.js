const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Evaluates a basic mathematical expression.')
        .addStringOption(option => 
            option.setName('expression')
                .setDescription('The math expression to solve (e.g. 5 + 5 * 2)')
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        try {
            // Strictly clean the input to allow only numbers and basic math operators
            const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
            
            if (!sanitized) throw new Error('Invalid math expression syntax.');

            // Safe use of Function constructor to evaluate purely mathematical strings
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${sanitized}`)();

            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Result is not a finite number.');
            }

            const embed = createEmbed({
                title: '🧮 Math Evaluation',
                fields: [
                    { name: 'Expression', value: `\`${sanitized}\``, inline: false },
                    { name: 'Result', value: `**${result}**`, inline: false }
                ],
                color: '#00FFCC'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Math Error',
                    description: 'Could not evaluate the expression. Ensure you are only using numbers and `+ - * / ( )`.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
