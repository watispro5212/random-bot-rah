const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Ejects an entity from the current sector.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The entity to be forcibly ejected.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Authorization reason for the ejection.')
                .setRequired(false))
        ,
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Violation of Sector Laws: No reason specified.';
        
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Ejection Failed',
                    description: 'Protocol Error: You cannot eject your own nexus connection.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Ejection Failed',
                    description: 'Target entity not found in current signal range.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        if (!targetMember.kickable) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Ejection Failed',
                    description: 'Insufficient Privilege: Target possesses reinforced shielding/roles.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        try {
            await targetUser.send({
                embeds: [createEmbed({
                    title: `👢 EJECTION NOTICE: ${interaction.guild.name}`,
                    description: 'You have been disconnected from the sector grid.',
                    fields: [
                        { name: 'Reason', value: `\`${reason}\`` },
                        { name: 'Authorized By', value: interaction.user.tag }
                    ],
                    color: 0xFEE75C,
                    footer: 'Nexus Security | Temporary Displacement'
                })]
            }).catch(() => null);

            await targetMember.kick(`Nexus Protocol [${interaction.user.tag}]: ${reason}`);
            
            logger.info(`User ${targetUser.tag} kicked by ${interaction.user.tag}. Reason: ${reason}`);

            await interaction.reply({
                embeds: [createEmbed({
                    title: '👢 Sector Ejection Successful',
                    thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
                    description: `\`[SYSTEM]\` Entity removed from the active sector grid.`,
                    fields: [
                        { name: 'Target Entity', value: `${targetUser.tag}\n(\`${targetUser.id}\`)`, inline: true },
                        { name: 'Authorized By', value: interaction.user.tag, inline: true },
                        { name: 'Protocol Reason', value: `\`${reason}\``, inline: false }
                    ],
                    color: 0xFEE75C,
                    footer: 'Nexus Security Operations | SEC-PROTOCOL-401'
                })]
            });
        } catch (error) {
            logger.error(`Failed to kick user ${targetUser.id}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ System Error',
                    description: 'An internal anomaly occurred during the ejection sequence.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
