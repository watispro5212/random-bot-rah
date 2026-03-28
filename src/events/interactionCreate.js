const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');
const cooldownManager = require('../utils/cooldownManager');
const { isOwner } = require('../utils/ownerGate');
const GuildConfig = require('../models/GuildConfig');

// --- GUILD CONFIG CACHE ---
const configCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

async function getCachedConfig(guildId) {
    if (configCache.has(guildId)) {
        const entry = configCache.get(guildId);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
            return entry.data;
        }
    }
    const data = await GuildConfig.findOne({ guildId });
    configCache.set(guildId, { data, timestamp: Date.now() });
    return data;
}

// Default cooldown durations (ms) per category
const COOLDOWN_DURATIONS = {
    economy: 5000,
    casino: 8000,
    moderation: 3000,
    fun: 3000,
    utility: 2000,
    default: 3000
};

// Categorize commands for cooldown purposes
const COMMAND_CATEGORIES = {
    economy: ['balance', 'daily', 'work', 'rob', 'transfer', 'leaderboard', 'shop', 'buy', 'inventory', 'quests'],
    casino: ['blackjack', 'slots', 'coinflip'],
    moderation: ['ban', 'kick', 'warn', 'purge', 'lock', 'unlock', 'slowmode', 'say', 'verify-setup', 'ticket-setup', 'automod-setup', 'log-setup', 'starboard-setup'],
    fun: ['8ball', 'roll', 'rps', 'trivia', 'hack', 'emojify', 'joke', 'fact', 'quote'],
    media: ['cat', 'dog', 'meme', 'urban'],
};

function getCooldownDuration(commandName) {
    for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
        if (commands.includes(commandName)) {
            return COOLDOWN_DURATIONS[category] || COOLDOWN_DURATIONS.default;
        }
    }
    return COOLDOWN_DURATIONS.default;
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        
        // --- BUTTON HANDLING ---
        if (interaction.isButton()) {
            if (interaction.customId === 'verify_role_button') {
                await interaction.deferReply({ flags: 64 });
                
                let verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Verified');
                
                try {
                    if (!verifiedRole) {
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
                await interaction.deferReply({ flags: 64 });
                
                try {
                    const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
                    if (existingChannel) {
                        return interaction.editReply({ 
                            embeds: [createEmbed({ title: '❌ Cannot Create Ticket', description: `You already have an open ticket: <#${existingChannel.id}>`, color: '#ED4245' })] 
                        });
                    }

                    const ticketChannel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory,
                                ],
                            },
                            {
                                id: client.user.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory,
                                    PermissionFlagsBits.ManageChannels,
                                ],
                            },
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
        if (interaction.isAutocomplete()) return; // Prevent crashes when typing
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // ==============================
        // SECURITY LAYER 1: BLACKLIST CHECK
        // ==============================
        if (client.blacklist && client.blacklist.has(interaction.user.id)) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '🚫 ACCESS REVOKED',
                    description: 'Your access to the Nexus Protocol has been permanently severed.\nContact the system administrator if you believe this is an error.',
                    color: '#FF0000'
                })],
                flags: 64
            });
        }

        // ==============================
        // SECURITY LAYER 2: GUILD-ONLY CHECK
        // ==============================
        if (!interaction.guild) {
            return interaction.reply({
                content: '`[ERROR]` Nexus commands can only be executed within a server sector.',
                flags: 64
            });
        }

        // ==============================
        // SECURITY LAYER 3: OWNER COMMAND GATE
        // ==============================
        if (command.ownerOnly && !isOwner(interaction.user.id)) {
            return interaction.reply({
                embeds: [createEmbed({
                    title: '🔒 ACCESS DENIED',
                    description: 'This protocol requires **Root Clearance**.\nYou do not have the required authorization level.',
                    color: '#FF0000'
                })],
                flags: 64
            });
        }

        // ==============================
        // SECURITY LAYER 4: COOLDOWN ENFORCEMENT
        // ==============================
        // Owner bypasses cooldowns
        if (!isOwner(interaction.user.id)) {
            const cooldownMs = getCooldownDuration(interaction.commandName);
            const { onCooldown, remaining } = cooldownManager.check(
                interaction.commandName,
                interaction.user.id,
                cooldownMs
            );

            if (onCooldown) {
                return interaction.reply({
                    embeds: [createEmbed({
                        title: '⏳ Cooldown Active',
                        description: `Protocol \`/${interaction.commandName}\` is on cooldown.\nPlease wait **${remaining}s** before re-executing.`,
                        color: '#E67E22'
                    })],
                    flags: 64
                });
            }
        }

        // --- DASHBOARD MODULE TOGGLES ---
        const config = await getCachedConfig(interaction.guild.id);
        
        if (config) {
            const economyCmds = ['balance', 'daily', 'work', 'buy', 'inventory', 'shop', 'transfer', 'quests'];
            const casinoCmds = ['blackjack', 'slots', 'coinflip', 'rob'];
            const funCmds = ['8ball', 'cat', 'dog', 'emojify', 'fact', 'hack', 'joke', 'meme', 'quote', 'roll', 'rps', 'say', 'trivia', 'urban'];
            const levelingCmds = ['rank', 'leaderboard'];

            if (!config.economyEnabled && economyCmds.includes(interaction.commandName)) {
                return interaction.reply({ 
                    embeds: [createEmbed({ title: '❌ Module Disabled', description: 'The **Economy** module is disabled on this server.', color: '#ED4245' })],
                    flags: 64 
                });
            }

            if (!config.casinoEnabled && casinoCmds.includes(interaction.commandName)) {
                return interaction.reply({ 
                    embeds: [createEmbed({ title: '❌ Module Disabled', description: 'The **Casino** module is disabled on this server.', color: '#ED4245' })],
                    flags: 64 
                });
            }

            if (!config.funEnabled && funCmds.includes(interaction.commandName)) {
                return interaction.reply({ 
                    embeds: [createEmbed({ title: '❌ Module Disabled', description: 'The **Fun** module is disabled on this server.', color: '#ED4245' })],
                    flags: 64 
                });
            }

            if (!config.levelingEnabled && levelingCmds.includes(interaction.commandName)) {
                return interaction.reply({ 
                    embeds: [createEmbed({ title: '❌ Module Disabled', description: 'The **Leveling** module is disabled on this server.', color: '#ED4245' })],
                    flags: 64 
                });
            }
        }

        // ==============================
        // EXECUTE COMMAND
        // ==============================
        try {
            await command.execute(interaction, client);
            logger.info(`[CMD] ${interaction.user.tag} → /${interaction.commandName} in ${interaction.guild.name}/#${interaction.channel?.name || 'unknown'}`);
        } catch (error) {
            logger.error(`Error executing /${interaction.commandName}: ${error}`);
            
            const errorEmbed = createEmbed({
                title: '❌ Execution Error',
                description: 'A critical error occurred while processing this protocol.\nThe incident has been logged for analysis.',
                color: '#ED4245',
                timestamp: false
            });

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
                } else {
                    await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                }
            } catch (replyError) {
                logger.error(`Failed to send error message for /${interaction.commandName}: ${replyError}`);
            }
        }
    },
};
