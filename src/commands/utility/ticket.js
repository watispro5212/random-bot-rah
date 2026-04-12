const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a private support ticket channel.')
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ticket').setRequired(false)),
    cooldown: 30,
    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guild = interaction.guild;
        const ticketName = `ticket-${interaction.user.username}-${Date.now().toString(36)}`.toLowerCase().slice(0, 100);

        try {
            const channel = await guild.channels.create({
                name: ticketName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                    { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                ],
                topic: `Ticket by ${interaction.user.tag} | Reason: ${reason}`
            });

            const closeBtn = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
            );

            await channel.send({
                embeds: [embedBuilder({
                    title: '🎫 Support Ticket',
                    description: `**Opened by:** ${interaction.user}\n**Reason:** ${reason}\n\nA staff member will assist you shortly. Click the button below to close this ticket.`,
                    color: '#00F5FF'
                })],
                components: [closeBtn]
            });

            await interaction.reply({
                embeds: [embedBuilder({
                    title: '🎫 Ticket Created',
                    description: `Your ticket has been created: ${channel}\nReason: ${reason}`,
                    color: '#00FF88'
                })],
                flags: [MessageFlags.Ephemeral]
            });

            // Ticket close handler
            const collector = channel.createMessageComponentCollector({ filter: i => i.customId === 'close_ticket' });
            collector.on('collect', async i => {
                await i.reply({ embeds: [embedBuilder({ title: '🔒 Ticket Closing', description: 'This ticket will be deleted in 5 seconds.', color: '#FF4444' })] });
                setTimeout(() => channel.delete().catch(() => {}), 5000);
            });
        } catch (err) {
            await interaction.reply({
                embeds: [embedBuilder({ title: '⚠️ Error', description: 'Failed to create ticket. Make sure I have channel management permissions.', color: '#FF4444' })],
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
