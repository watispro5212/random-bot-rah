const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Execute raw JavaScript in the Nexus core. (Owner Only)')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The JavaScript code to execute.')
                .setRequired(true)),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const code = interaction.options.getString('code');

        try {
            let result = eval(code);

            if (result instanceof Promise) result = await result;
            if (typeof result !== 'string') result = require('util').inspect(result, { depth: 2 });

            // Truncate long output
            if (result.length > 1900) result = result.substring(0, 1900) + '\n...truncated';

            const embed = createEmbed({
                title: '⚙️ Eval — Execution Complete',
                description: `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n**Output:**\n\`\`\`js\n${result}\n\`\`\``,
                color: '#00FF88',
                footer: 'Root Terminal'
            });

            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (error) {
            const embed = createEmbed({
                title: '❌ Eval — Execution Failed',
                description: `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n**Error:**\n\`\`\`diff\n- ${error.message}\n\`\`\``,
                color: '#FF0000',
                footer: 'Root Terminal'
            });

            await interaction.reply({ embeds: [embed], flags: 64 });
        }
    },
};
