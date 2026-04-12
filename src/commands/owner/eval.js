const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const util = require('util');

module.exports = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Executes raw JavaScript logic within the protocol terminal.')
        .addStringOption(option => 
            option.setName('code')
                .setDescription('The snippet to execute.')
                .setRequired(true))
        .setDefaultMemberPermissions(0), 
    async execute(interaction, client) {
        const code = interaction.options.getString('code');
        
        try {
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = util.inspect(evaled, { depth: 1 });
            }

            
            const cleaned = evaled.replace(client.token, '[REDACTED TOKEN]');

            const resultEmbed = embedBuilder({
                title: 'Code Execution Success',
                description: `\`\`\`js\n${cleaned.length > 2000 ? cleaned.slice(0, 1990) + '...' : cleaned}\n\`\`\``,
                fields: [
                    { name: 'Input', value: `\`\`\`js\n${code}\n\`\`\`` }
                ],
                color: '#00FF88'
            });

            await interaction.reply({ embeds: [resultEmbed], flags: [MessageFlags.Ephemeral] });
        } catch (error) {
            const errEmbed = embedBuilder({
                title: 'Code Execution Failed',
                description: `\`\`\`js\n${error.message}\n\`\`\``,
                fields: [
                    { name: 'Input', value: `\`\`\`js\n${code}\n\`\`\`` }
                ],
                color: '#FF4444'
            });

            await interaction.reply({ embeds: [errEmbed], flags: [MessageFlags.Ephemeral] });
        }
    },
};
