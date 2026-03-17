const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Executes the ultimate sanction: Persistent Sector Ban.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The entity to be permanently exiled.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Authorization reason for the ban.')
                .setRequired(false))
        ,
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Protocol Violation: No reason specified.';
        
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Execution Failed',
                    description: 'Protocol Error: You cannot ban your own nexus link.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Execution Failed',
                    description: 'Target entity not detected in current sector grid.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        if (!targetMember.bannable) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Execution Failed',
                    description: 'Insufficient Permission: Target possesses high-level clearance/shields.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        try {
            // Attempt to DM the user before banning
            await targetUser.send({
                embeds: [createEmbed({
                    title: `🔨 TERMINATION NOTICE: ${interaction.guild.name}`,
                    description: `Your access to this sector has been permanently revoked.`,
                    fields: [
                        { name: 'Reason', value: `\`${reason}\`` },
                        { name: 'Authorized By', value: interaction.user.tag }
                    ],
                    color: 0xED4245,
                    footer: 'Nexus Security | Persistent Ban Active'
                })]
            }).catch(() => null);

            await targetMember.ban({ reason: `Nexus Protocol [${interaction.user.tag}]: ${reason}` });
            
            logger.info(`User ${targetUser.tag} banned by ${interaction.user.tag}. Reason: ${reason}`);

            await interaction.reply({
                embeds: [createEmbed({
                    title: '🔨 Permanent Execution Successful',
                    thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
                    description: `\`[SYSTEM]\` Entity successfully purged from the sector grid.`,
                    fields: [
                        { name: 'Target Entity', value: `${targetUser.tag}\n(\`${targetUser.id}\`)`, inline: true },
                        { name: 'Authorized By', value: interaction.user.tag, inline: true },
                        { name: 'Protocol Reason', value: `\`${reason}\``, inline: false }
                    ],
                    color: 0xED4245,
                    footer: 'Nexus Security Operations | SEC-PROTOCOL-402'
                })]
            });
        } catch (error) {
            logger.error(`Failed to ban user ${targetUser.id}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ System Error',
                    description: 'An internal anomaly occurred during the ban sequence.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
