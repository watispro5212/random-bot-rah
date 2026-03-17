const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const { createEmbed } = require('../utils/embed');

const TRIVIA_QUESTIONS = [
    { q: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], a: "Paris" },
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: "Mars" },
    { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], a: "Pacific" },
    { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], a: "William Shakespeare" },
    { q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], a: "Diamond" },
    { q: "What is the main language spoken in Brazil?", options: ["Spanish", "French", "Portuguese", "English"], a: "Portuguese" },
    { q: "How many legs does a spider have?", options: ["6", "8", "10", "12"], a: "8" },
    { q: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "HO2"], a: "H2O" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Test your knowledge with a random trivia question!'),
    async execute(interaction) {
        
        // Grab a random question
        const questionObj = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
        
        // Shuffle options so the correct answer isn't always in the same button spot
        const shuffledOptions = [...questionObj.options].sort(() => Math.random() - 0.5);

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((opt, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`trivia_${index}`)
                    .setLabel(opt)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const embed = createEmbed({
            title: '🧠 Trivia Time!',
            description: `**${questionObj.q}**\n\n*You have 15 seconds to answer.*`,
            color: '#00FFCC'
        });

        const reply = await interaction.reply({ 
            embeds: [embed], 
            components: [row],
            withResponse: true 
        });

        const collector = reply.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            time: 15_000 
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Start your own trivia game with `/trivia`!', flags: 64 });
            }

            const chosenAnswer = shuffledOptions[parseInt(i.customId.split('_')[1])];
            const isCorrect = chosenAnswer === questionObj.a;

            const resultEmbed = createEmbed({
                title: isCorrect ? '✅ Correct!' : '❌ Incorrect!',
                description: `**${questionObj.q}**\n\nYou chose: \`${chosenAnswer}\`\nCorrect Answer: \`${questionObj.a}\``,
                color: isCorrect ? '#00FFCC' : '#FF4B2B'
            });

            await i.update({ embeds: [resultEmbed], components: [] });
            collector.stop('answered');
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = createEmbed({
                    title: '⏰ Time\'s Up!',
                    description: `**${questionObj.q}**\n\nCorrect Answer: \`${questionObj.a}\``,
                    color: '#A3B1C6'
                });
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => null);
            }
        });
    },
};
