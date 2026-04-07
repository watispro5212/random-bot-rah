const { EmbedBuilder } = require('discord.js');

/**
 * Standardized Embed Builder for Nexus Protocol v7
 * @param {object} options - Embed options
 * @param {string} options.title - The title of the embed
 * @param {string} options.description - The description of the embed
 * @param {string} [options.color] - Hex color code (default: #5865F2)
 * @param {object[]} [options.fields] - Array of field objects {name, value, inline}
 * @param {string} [options.thumbnail] - Thumbnail URL
 * @param {string} [options.image] - Image URL
 * @param {string} [options.footer] - Footer text
 * @param {string} [options.author] - Author name
 * @param {string} [options.authorIcon] - Author icon URL
 * @param {string} [options.url] - Title URL
 * @returns {EmbedBuilder}
 */
module.exports = (options) => {
    const embed = new EmbedBuilder()
        .setColor(options.color || '#5865F2')
        .setTimestamp();

    const trim = (str, max) => str && str.length > max ? str.slice(0, max - 3) + '...' : str;

    if (options.title) embed.setTitle(trim(options.title, 256));
    if (options.description) embed.setDescription(trim(options.description, 4096));
    if (options.url) embed.setURL(options.url);

    if (options.fields && options.fields.length > 0) {
        const safeFields = options.fields.slice(0, 25).map(f => ({
            name: trim(f.name, 256),
            value: trim(f.value, 1024),
            inline: !!f.inline
        }));
        embed.addFields(safeFields);
    }

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);

    if (options.author) {
        embed.setAuthor({
            name: trim(options.author, 256),
            iconURL: options.authorIcon || undefined
        });
    }

    embed.setFooter({
        text: trim(options.footer || 'Nexus Protocol v7 • Advanced Intelligence', 2048)
    });

    return embed;
};
