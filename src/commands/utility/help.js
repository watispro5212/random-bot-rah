const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands.'),
    async execute(interaction, client) {
        const commands = client.commands;
        const categories = {};

        const commandsDir = path.join(__dirname, '..');
        const dirEntries = fs.readdirSync(commandsDir, { withFileTypes: true });

        for (const entry of dirEntries) {
            if (entry.isDirectory()) {
                const categoryName = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
                const categoryCommands = fs.readdirSync(path.join(commandsDir, entry.name))
                    .filter(file => file.endsWith('.js'))
                    .map(file => {
                        const cmd = require(path.join(commandsDir, entry.name, file));
                        return `\`/${cmd.data.name}\``;
                    });
                
                if (categoryCommands.length > 0) {
                    categories[categoryName] = categoryCommands.join(', ');
                }
            }
        }

        const fields = Object.entries(categories).map(([name, cmds]) => ({
            name: `${name} Commands`,
            value: cmds,
            inline: false
        }));

        const helpEmbed = embedBuilder({
            title: 'Nexus Protocol Help',
            description: 'Explore the advanced features of the Nexus Protocol. Use `/` to see all available slash commands.',
            fields: fields,
            color: '#5865F2',
            footer: 'Nexus Protocol • V7 Architecture'
        });

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
