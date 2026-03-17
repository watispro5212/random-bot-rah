const { SlashCommandBuilder } = require('discord.js');

const CHAR_TO_EMOJI = {
    'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮',
    'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷',
    's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
    '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣',
    '8': '8️⃣', '9': '9️⃣', '!': '❗', '?': '❓', ' ': '   '
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Convert text data into an encrypted emoji string.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to encrypt.')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text').toLowerCase();
        
        if (text.length > 50) {
            return interaction.reply({ content: 'Payload too large. Keep it under 50 characters.', flags: 64 });
        }

        let emojified = '';
        for (const char of text) {
            emojified += CHAR_TO_EMOJI[char] || char; // fallback to original char if not found
            emojified += ' '; // add a small gap
        }

        await interaction.reply(emojified);
    },
};
