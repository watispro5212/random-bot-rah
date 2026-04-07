const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove a role from a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Add a role to a user.')
                .addUserOption(option =>
                    option.setName('target').setDescription('The user.').setRequired(true))
                .addRoleOption(option =>
                    option.setName('role').setDescription('The role to add.').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a role from a user.')
                .addUserOption(option =>
                    option.setName('target').setDescription('The user.').setRequired(true))
                .addRoleOption(option =>
                    option.setName('role').setDescription('The role to remove.').setRequired(true))),
    cooldown: 5,
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        if (!target) {
            return interaction.reply({ content: '❌ User not found.', ephemeral: true });
        }

        // Check role hierarchy
        if (role.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({ content: '❌ That role is higher than my highest role.', ephemeral: true });
        }

        try {
            if (subcommand === 'add') {
                await target.roles.add(role);
                await interaction.reply({
                    embeds: [embedBuilder({
                        title: '✅ Role Added',
                        description: `**User:** ${target.user.tag}\n**Role:** ${role}\n**Moderator:** ${interaction.user.tag}`,
                        color: '#2ECC71'
                    })]
                });
            } else {
                await target.roles.remove(role);
                await interaction.reply({
                    embeds: [embedBuilder({
                        title: '✅ Role Removed',
                        description: `**User:** ${target.user.tag}\n**Role:** ${role}\n**Moderator:** ${interaction.user.tag}`,
                        color: '#E67E22'
                    })]
                });
            }
        } catch (err) {
            await interaction.reply({ content: `❌ Failed: \`${err.message}\``, ephemeral: true });
        }
    },
};
