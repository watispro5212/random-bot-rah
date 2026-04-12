const { SlashCommandBuilder } = require('discord.js')
const { MessageFlags } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');


const shopItems = [
    { id: 'cyberlink', name: '🔗 Cyber-Link', price: 5000 },
    { id: 'neuralshunt', name: '🧠 Neural-Shunt', price: 12000 },
    { id: 'datacore', name: '💎 Data-Core', price: 25000 },
    { id: 'biohack', name: '🧬 Bio-Hack', price: 50000 },
    { id: 'shardkey', name: '🔑 Shard-Key', price: 100000 },
    { id: 'rootaccess', name: '👑 Root-Access', price: 500000 },
    { id: 'xpbooster', name: '⚡ XP Booster', price: 8000 },
    { id: 'shield', name: '🛡️ Shield Module', price: 15000 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase an item from the hardware catalog.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item ID to purchase (e.g. cyberlink, shield).')
                .setRequired(true)
                .addChoices(...shopItems.map(i => ({ name: `${i.name} — $${i.price.toLocaleString()}`, value: i.id })))),
    cooldown: 5,
    async execute(interaction, client) {
        const itemId = interaction.options.getString('item');
        const item = shopItems.find(i => i.id === itemId);

        if (!item) {
            return interaction.reply({ content: '❌ Item not found. Use `/shop` to see available items.', flags: [MessageFlags.Ephemeral] });
        }

        let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!userData) {
            userData = new User({ userId: interaction.user.id, guildId: interaction.guild.id });
        }

        if (userData.balance < item.price) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Insufficient Funds',
                    description: `You need \`$${item.price.toLocaleString()}\` but only have \`$${userData.balance.toLocaleString()}\`.`,
                    color: '#ED4245'
                })],
                flags: [MessageFlags.Ephemeral]
            });
        }

        userData.balance -= item.price;
        userData.inventory.push(item.id);
        await userData.save();

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🛒 Purchase Complete!',
                description: `**Acquired:** ${item.name}\n**Cost:** \`$${item.price.toLocaleString()}\`\n**Remaining Balance:** \`$${userData.balance.toLocaleString()}\``,
                color: '#2ECC71'
            })]
        });
    },
};
