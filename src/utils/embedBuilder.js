const { EmbedBuilder } = require('discord.js');

/**
 * Standardized Embed Builder for Nexus Protocol
 * @param {object} options - Embed options
 * @param {string} options.title - The title of the embed
 * @param {string} options.description - The description of the embed
 * @param {string} [options.color] - Hex color code (default: #5865F2)
 * @param {object[]} [options.fields] - Array of field objects {name, value, inline}
 * @param {string} [options.thumbnail] - Thumbnail URL
 * @param {string} [options.image] - Image URL
 * @param {string} [options.footer] - Footer text
 * @returns {EmbedBuilder}
 */
module.exports = (options) => {
    const embed = new EmbedBuilder()
        .setTitle(options.title || null)
        .setDescription(options.description || null)
        .setColor(options.color || '#5865F2')
        .setTimestamp();

    if (options.fields && options.fields.length > 0) {
        embed.addFields(options.fields);
    }

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    
    embed.setFooter({ 
        text: options.footer || 'Nexus Protocol • Advanced Intelligence',
        iconURL: 'https://vantage.csw.lenovo.com/v1/web/containerwidget/default/favicon.ico' // Placeholder, replace with actual bot icon
    });

    return embed;
};
