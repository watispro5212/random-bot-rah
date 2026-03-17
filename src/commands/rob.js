const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const ROB_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours
const BASE_SUCCESS_CHANCE = 0.50; // 50%
const FINE_AMOUNT = 300;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Execute a cyber-heist on another user\'s local wallet.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to target')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const robberId = interaction.user.id;
        const targetId = targetUser.id;

        if (targetUser.bot || targetId === robberId) {
            return interaction.reply({ 
                content: 'Invalid target parameters.', 
                flags: 64 
            });
        }

        const robberData = await economy.getUser(robberId, interaction.guild.id);
        
        // Cooldown Check
        const now = Date.now();
        const last = robberData.lastRob || 0;
        const diff = now - last;
        
        if (diff < ROB_COOLDOWN_MS) {
            const minutes = Math.ceil((ROB_COOLDOWN_MS - diff) / 60000);
            return interaction.reply({
                embeds: [createEmbed({
                    title: '⏳ Heat Level High',
                    description: `Nexus Security is actively scanning for your signature. Lay low for **${minutes} minutes** before attempting another heist.`,
                    color: '#FF4B2B'
                })],
                flags: 64
            });
        }

        if (robberData.wallet < FINE_AMOUNT) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Funds',
                    description: `You need at least **${FINE_AMOUNT} Credits** in your local wallet to cover potential Nexus Security fines.`,
                    color: '#FF4B2B'
                })],
                flags: 64
            });
        }

        const targetData = await economy.getUser(targetId, interaction.guild.id);

        if (targetData.wallet < 100) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Low Value Target',
                    description: `Target <@${targetId}> has less than 100 Credits in their wallet. Not worth the network bandwidth.`,
                    color: '#FF4B2B'
                })],
                flags: 64
            });
        }

        // Execution
        robberData.lastRob = now;
        
        if (Math.random() > BASE_SUCCESS_CHANCE) {
            // FAILED
            robberData.wallet -= FINE_AMOUNT;
            await robberData.save();

            return interaction.reply({
                embeds: [createEmbed({
                    title: '🚨 Intrusion Detected!',
                    description: `Nexus Security blocked your firewall breach on <@${targetId}>. You were fined **${FINE_AMOUNT} Credits**.\n\nCurrent Wallet: **${robberData.wallet.toLocaleString()}**`,
                    color: '#FF4B2B',
                    thumbnail: 'https://cdn4.iconfinder.com/data/icons/basic-ui-color/512/siren-512.png'
                })]
            });
        } else {
            // SUCCESS - steal 20-40% of their wallet
            const factor = (Math.floor(Math.random() * 21) + 20) / 100;
            const stolen = Math.floor(targetData.wallet * factor);
            
            robberData.wallet += stolen;
            targetData.wallet -= stolen;

            await robberData.save();
            await targetData.save();

            return interaction.reply({
                embeds: [createEmbed({
                    title: '🥷 Cyber-Heist Successful',
                    description: `You successfully bypassed <@${targetId}>'s firewall and extracted **${stolen.toLocaleString()} Credits** from their wallet!\n\nCurrent Wallet: **${robberData.wallet.toLocaleString()}**`,
                    color: '#00FFCC',
                    thumbnail: 'https://cdn1.iconfinder.com/data/icons/ninja-14/512/Ninja-512.png'
                })]
            });
        }
    },
};
