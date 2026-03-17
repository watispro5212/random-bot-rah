const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const FAKE_EMAILS = ['admin@nexus.io', 'coolguy2000@aol.com', 'ilovediscord@gmail.com', 'hacker_man@darkweb.net', 'password123@yahoo.com'];
const FAKE_PASSWORDS = ['Hunter2', 'P@ssw0rd!', 'ilovemymom', 'qwertyuiop', '12345678'];
const FAKE_IP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Initiate a harmless penetration test on a target.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to target.')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: 'Are you trying to penetrate your own firewall? That\'s sad.', flags: 64 });
        }
        
        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: 'Access Denied. My firewall is impenetrable.', flags: 64 });
        }

        const msg = await interaction.reply({ content: `[SYSTEM] Initiating penetration protocol on ${target.username}...`, withResponse: true });

        const steps = [
            `[SYSTEM] Bypassing mainframe security protocols...`,
            `[SYSTEM] Extracted IP Address: ${FAKE_IP()}`,
            `[SYSTEM] Decrypting database hashes...`,
            `[SUCCESS] Email acquired: ${target.username.toLowerCase()}@${FAKE_EMAILS[Math.floor(Math.random()*FAKE_EMAILS.length)].split('@')[1]}`,
            `[SUCCESS] Password acquired: ${FAKE_PASSWORDS[Math.floor(Math.random()*FAKE_PASSWORDS.length)]}`,
            `[SYSTEM] Uploading malicious payload...`,
            `[SYSTEM] Planting evidence of internet piracy...`,
            `[SUCCESS] Hack complete. Data sold on the dark web for 5 Nexus Credits.`
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Keep the initial username mention + the new step to make it feel like a real terminal
            await interaction.editReply(`[SYSTEM] Initiating penetration protocol on ${target.username}...\n${steps.slice(0, i+1).join('\n')}`);
        }
    },
};
