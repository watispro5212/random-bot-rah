const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const warns = require('../utils/WarningManager');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Issues a formal Protocol Strike to an entity.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('The entity to be formally warned.')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('reason')
                .setDescription('Authorization reason for the strike.')
                .setRequired(true))
        ,
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        if (target.bot) {
            return interaction.reply({ content: '`[ERROR]` Artificial lifeforms are exempt from protocol strikes.', flags: 64 });
        }
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '`[ERROR]` Protocol self-striking is prohibited.', flags: 64 });
        }

        warns.addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
        const count = warns.getWarnings(interaction.guild.id, target.id).length;

        logger.info(`${interaction.user.tag} warned ${target.tag} in ${interaction.guild.name} (Strike ${count})`);

        try {
            await target.send({
                embeds: [createEmbed({
                    title: `⚠️ PROTOCOL STRIKE DETECTED: ${interaction.guild.name}`,
                    description: `\`[SYSTEM]\` You have incurred a formal disciplinary strike.`,
                    fields: [
                        { name: 'Protocol Violation', value: `\`${reason}\`` },
                        { name: 'Strike Index', value: `\`${count}\` accumulated strike(s)` }
                    ],
                    color: '#FFCC00',
                    footer: 'Nexus Security | Repeated violations will lead to ejection.'
                })]
            });
        } catch (err) {}

        const embed = createEmbed({
            title: '⚠️ Protocol Strike Issued',
            thumbnail: target.displayAvatarURL({ dynamic: true }),
            description: `Successfully logged a strike against <@${target.id}>.\nEntity now has \`${count}\` strike(s) on record.`,
            fields: [
                { name: 'Protocol Reason', value: `\`${reason}\``, inline: false },
                { name: 'Authorized By', value: interaction.user.tag, inline: true }
            ],
            color: '#FFCC00',
            footer: 'Nexus Security Database | SEC-STRIKE-IDX'
        });

        await interaction.reply({ embeds: [embed] });
    },
};
