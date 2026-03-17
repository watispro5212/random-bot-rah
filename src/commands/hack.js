const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

const FAKE_EMAILS = ['admin@nexus.io', 'ghost@darknet.io', 'system_root@nexus.sec', 'cipher@vault.net', 'null_pointer@void.com'];
const FAKE_PASSWORDS = ['Hunter2', 'P@ssw0rd!', 'Cipher77', 'RootAccess99', 'Hex_0xFF_'];
const FAKE_IP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Initiates a simulated "Mainframe Penetration Protocol" on a subject.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The subject to penetrate.')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '`[ERROR]` Subject attempting to bypass own neural firewall. Access denied by self.', flags: 64 });
        }
        
        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: '`[ALERT]` Nexus-AI Firewalls are impenetrable by standard protocols.', flags: 64 });
        }

        await interaction.reply({ 
            content: `\`[SYSTEM]\` Initiating **Mainframe Penetration Protocol** on subject: **${target.username}**...`, 
            withResponse: true 
        });

        const steps = [
            `\`[SYSTEM]\` Bypassing level-3 neural encryption...`,
            `\`[SYSTEM]\` Extracted Network ID: \`${FAKE_IP()}\``,
            `\`[SYSTEM]\` Decrypting biometric hash tables...`,
            `\`[SUCCESS]\` Data-Link Acquired: \`${target.username.toLowerCase()}@${FAKE_EMAILS[Math.floor(Math.random()*FAKE_EMAILS.length)].split('@')[1]}\``,
            `\`[SUCCESS]\` Pass-Relay Decrypted: \`${FAKE_PASSWORDS[Math.floor(Math.random()*FAKE_PASSWORDS.length)]}\``,
            `\`[SYSTEM]\` Injecting polymorphic data-sludge...`,
            `\`[SYSTEM]\` Ghosting subject logs from sector history...`,
            `\`[SUCCESS]\` Penetration completed. Subject data archived and liquidated.`
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1400));
            await interaction.editReply(`\`[SYSTEM]\` Initiating **Mainframe Penetration Protocol** on subject: **${target.username}**...\n${steps.slice(0, i+1).map(s => `> ${s}`).join('\n')}`);
        }
    },
};
