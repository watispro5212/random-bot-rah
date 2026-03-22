const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const { isOwner } = require('../utils/ownerGate');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Hot-reload a command module. (Owner Only)')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command name to reload.')
                .setRequired(true)),
    ownerOnly: true,
    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: '`[ACCESS_DENIED]` Root clearance required.', flags: 64 });
        }

        const commandName = interaction.options.getString('command').toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply({ content: `\`[ERROR]\` Command \`${commandName}\` not found in registry.`, flags: 64 });
        }

        try {
            const commandPath = path.join(__dirname, `${commandName}.js`);
            delete require.cache[require.resolve(commandPath)];
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);

            const embed = createEmbed({
                title: '🔄 Module Reloaded',
                description: `Command \`/${commandName}\` has been hot-reloaded successfully.`,
                color: '#00FF88',
                footer: `Reload by ${interaction.user.tag}`
            });

            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (error) {
            const embed = createEmbed({
                title: '❌ Reload Failed',
                description: `\`\`\`diff\n- ${error.message}\n\`\`\``,
                color: '#FF0000',
                footer: 'Root Terminal'
            });

            await interaction.reply({ embeds: [embed], flags: 64 });
        }
    },
};
