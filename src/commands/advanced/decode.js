const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decode')
        .setDescription('Decode a data string using various protocols.')
        .addStringOption(option =>
            option.setName('data')
                .setDescription('The string to decode.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('cipher')
                .setDescription('The cipher mode to use.')
                .setRequired(false)
                .addChoices(
                    { name: 'Hex + Binary (default)', value: 'default' },
                    { name: 'ROT13', value: 'rot13' },
                    { name: 'Base64 Encode', value: 'base64' },
                    { name: 'Reverse', value: 'reverse' },
                    { name: 'NATO Alphabet', value: 'nato' }
                )),
    cooldown: 5,
    async execute(interaction, client) {
        const signal = interaction.options.getString('signal');
        const cipher = interaction.options.getString('cipher') || 'default';

        await interaction.deferReply({ ephemeral: true });

        let result = '';
        let protocol = '';

        switch (cipher) {
            case 'rot13':
                result = signal.replace(/[a-zA-Z]/g, c => {
                    const base = c <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
                });
                protocol = 'ROT-13 Caesar';
                break;
            case 'base64':
                result = Buffer.from(signal).toString('base64');
                protocol = 'BASE-64 Encoding';
                break;
            case 'reverse':
                result = signal.split('').reverse().join('');
                protocol = 'REVERSE-STREAM';
                break;
            case 'nato': {
                const natoMap = { A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu' };
                result = signal.toUpperCase().split('').map(c => natoMap[c] || c).join(' ');
                protocol = 'NATO-PHONETIC';
                break;
            }
            default: {
                const hex = Buffer.from(signal).toString('hex').toUpperCase();
                const binary = signal.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                result = `**Hex:** \`${hex.slice(0, 64)}${hex.length > 64 ? '...' : ''}\`\n**Binary:** \`${binary.slice(0, 64)}${binary.length > 64 ? '...' : ''}\``;
                protocol = 'AES-NEXUS-256';
            }
        }

        const displayResult = cipher === 'default' ? result : `\`${result.slice(0, 500)}\``;

        await interaction.editReply({
            embeds: [embedBuilder({
                title: '🔓 Signal Decrypted',
                description: `**Source:** \`${signal.slice(0, 100)}\`\n**Protocol:** \`${protocol}\`\n**Output:** ${displayResult}`,
                fields: [
                    { name: 'Integrity', value: '`99.9%`', inline: true },
                    { name: 'Cipher', value: `\`${protocol}\``, inline: true },
                    { name: 'Length', value: `\`${signal.length} chars\``, inline: true }
                ],
                color: '#3498DB'
            })]
        });
    },
};
