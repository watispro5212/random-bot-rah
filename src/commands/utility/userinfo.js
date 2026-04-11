const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Full dossier on a user — account info, roles, and status.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to scan.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getMember('target') || interaction.member;
        const user = target.user;

        
        const accountAge = Math.floor((Date.now() - user.createdTimestamp) / 86400000);

        
        const topRole = target.roles.highest.id !== interaction.guild.id
            ? target.roles.highest
            : null;

        
        const roles = target.roles.cache
            .filter(r => r.name !== '@everyone')
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .slice(0, 15);

        const statusMap = {
            online: '🟢 Online',
            idle: '🌙 Idle',
            dnd: '🔴 Do Not Disturb',
            offline: '⚫ Offline',
        };

        const infoEmbed = embedBuilder({
            title: `User Profile — ${user.username}`,
            description: [
                `**User ID:** ${user.id}`,
                `**Status:** ${statusMap[target.presence?.status] || '⚫ Offline'}`,
                `**Client:** ${user.bot ? 'Bot' : 'User'}`,
                `**History:** ${accountAge} days since creation`,
            ].join('\n'),
            fields: [
                { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Joined', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Primary Role', value: topRole ? `${topRole}` : 'None', inline: true },
                { name: `Roles (${target.roles.cache.size - 1})`, value: roles.length > 0 ? roles.join(' ') : 'None', inline: false },
            ],
            thumbnail: user.displayAvatarURL({ dynamic: true, size: 512 })
        });

        await interaction.reply({ embeds: [infoEmbed] });
    },
};
