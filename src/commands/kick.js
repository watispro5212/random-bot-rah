const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'You cannot kick yourself!',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'That user is not in this server.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        if (!targetMember.kickable) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'I do not have permission to kick this user. They may have a higher role than me.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }

        try {
            await targetUser.send({
                embeds: [createEmbed({
                    title: `👢 You have been kicked from ${interaction.guild.name}`,
                    fields: [
                        { name: 'Reason', value: reason },
                        { name: 'Moderator', value: interaction.user.tag }
                    ],
                    color: 0xFEE75C // Yellow WARNING color
                })]
            }).catch(() => null);

            await targetMember.kick(`Kicked by ${interaction.user.tag}: ${reason}`);
            
            logger.info(`User ${targetUser.tag} kicked by ${interaction.user.tag}. Reason: ${reason}`);

            await interaction.reply({
                embeds: [createEmbed({
                    title: '👢 User Kicked',
                    thumbnail: targetUser.displayAvatarURL(),
                    fields: [
                        { name: 'User', value: `${targetUser.tag} (${targetUser.id})` },
                        { name: 'Moderator', value: interaction.user.tag },
                        { name: 'Reason', value: reason }
                    ],
                    color: 0xFEE75C
                })]
            });
        } catch (error) {
            logger.error(`Failed to kick user ${targetUser.id}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'An error occurred while trying to kick the user.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
