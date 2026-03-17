const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Executes high-speed neural computation on numerical expressions.')
        .addStringOption(option => 
            option.setName('expression')
                .setDescription('The numerical algorithm to solve.')
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        try {
            const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
            if (!sanitized) throw new Error('Algorithm Rejected: Illegal syntax characters.');

            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${sanitized}`)();

            if (isNaN(result) || !isFinite(result)) throw new Error('Algorithm Rejected: Result out of bounds.');

            const embed = createEmbed({
                title: '🧮 Nexus Neural Computation',
                description: `\`[PROCESSING ALGORITHM...SUCCESS]\``,
                fields: [
                    { name: '📥 Input Algorithm', value: `\`${sanitized}\``, inline: false },
                    { name: '📤 Computation Output', value: `\`[ RESULT ]\` **${result}**`, inline: false }
                ],
                color: '#00FFCC',
                footer: 'Core Processor: Nexus-X1 | Computation Time: <1ms'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Computation Error',
                    description: `\`[FATAL]\` Protocol failed to evaluate the algorithm. Use only valid operators: \`+ - * / ( )\`.`,
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
