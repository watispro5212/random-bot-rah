const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        
        // --- BUTTON HANDLING ---
        if (interaction.isButton()) {
            if (interaction.customId === 'verify_role_button') {
                await interaction.deferReply({ ephemeral: true });
                
                let verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Verified');
                
                try {
                    if (!verifiedRole) {
                        // Create it if it doesn't exist
                        verifiedRole = await interaction.guild.roles.create({
                            name: 'Verified',
                            color: '#2ecc71',
                            reason: 'Auto-created by NexusBot Verification System'
                        });
                        logger.info(`Auto-created Verified role in ${interaction.guild.name}`);
                    }

                    if (interaction.member.roles.cache.has(verifiedRole.id)) {
                        return interaction.editReply({
                            embeds: [createEmbed({ title: 'You are already verified!', color: '#FEE75C' })]
                        });
                    }

                    await interaction.member.roles.add(verifiedRole);
                    logger.info(`Verified user ${interaction.user.tag}`);

                    return interaction.editReply({
                        embeds: [createEmbed({ title: '✅ Verification Successful!', description: 'You now have access to the server.', color: '#57F287' })]
                    });

                } catch (error) {
                    logger.error(`Failed to verify ${interaction.user.tag}: ${error}`);
                    return interaction.editReply({
                        embeds: [createEmbed({ title: '❌ Verification Failed', description: 'Could not assign role. Ensure my bot role is higher than the "Verified" role.', color: '#ED4245' })]
                    });
                }
            }

            // --- TICKET CREATION ---
            if (interaction.customId === 'create_ticket_btn') {
                await interaction.deferReply({ ephemeral: true });
                
                try {
                    // Check if they already have one open
                    const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
                    if (existingChannel) {
                        return interaction.editReply({ 
                            embeds: [createEmbed({ title: '❌ Cannot Create Ticket', description: `You already have an open ticket: <#${existingChannel.id}>`, color: '#ED4245' })] 
                        });
                    }

                    const ticketChannel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: 0, // GuildText
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id, // @everyone
                                deny: ['ViewChannel'],
                            },
                            {
                                id: interaction.user.id, // The user
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                            },
                            {
                                // Give the bot itself permissions explicitly
                                id: client.user.id,
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels'],
                            }
                        ],
                    });

                    const closeRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_ticket_btn')
                            .setLabel('🔒 Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                    );

                    const ticketEmbed = createEmbed({
                        title: `Support Ticket — ${interaction.user.tag}`,
                        description: `Hey <@${interaction.user.id}>! Welcome to your ticket.\n\nPlease describe your issue and a staff member will be with you shortly.\n\n*Click the button below to close this ticket.*`,
                        color: '#3498DB'
                    });

                    await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [ticketEmbed], components: [closeRow] });

                    logger.info(`Ticket created for ${interaction.user.tag} (#${ticketChannel.name})`);
                    return interaction.editReply({ 
                        embeds: [createEmbed({ title: '✅ Ticket Created', description: `Your ticket has been opened: <#${ticketChannel.id}>`, color: '#57F287' })] 
                    });

                } catch (error) {
                    logger.error(`Failed to create ticket for ${interaction.user.tag}: ${error}`);
                    return interaction.editReply({ content: 'Failed to create a ticket channel. Check my permissions (Manage Channels).' });
                }
            }

            // --- TICKET CLOSING ---
            if (interaction.customId === 'close_ticket_btn') {
                const channel = interaction.channel;
                await interaction.reply({ 
                    embeds: [createEmbed({ title: '🔒 Closing Ticket', description: 'This ticket will be deleted in 5 seconds...', color: '#E67E22' })] 
                });
                
                setTimeout(() => {
                    channel.delete().catch(err => logger.error(`Failed to delete ticket channel: ${err}`));
                }, 5000);
            }
        }

        // --- COMMAND HANDLING ---
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            logger.info(`${interaction.user.tag} executed /${interaction.commandName} in #${interaction.channel?.name || 'DM'}`);
        } catch (error) {
            logger.error(`Error executing /${interaction.commandName}: ${error}`);
            
            const errorEmbed = createEmbed({
                title: '❌ Error',
                description: 'There was an error while executing this command!',
                color: 0xED4245,
                timestamp: false
            });

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
