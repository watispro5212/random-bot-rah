const { EmbedBuilder } = require('discord.js');


const theme = {
    primary: '#00F5FF',
    secondary: '#7000FF',
    success: '#00FF88',
    danger: '#FF4444'
};

module.exports = (options) => {
    const embed = new EmbedBuilder()
        .setColor(options.color || theme.primary)
        .setTimestamp();

    const trim = (str, max) => str && str.length > max ? str.slice(0, max - 3) + '...' : str;

    
    if (options.title) {
        embed.setTitle(trim(options.title, 256));
    }

    
    if (options.description) {
        embed.setDescription(trim(options.description, 4096));
    }

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

    
    const versionTag = 'Nexus v12.0.0';
    const footerText = trim(options.footer || versionTag, 2048);

    embed.setFooter({
        text: footerText
    });

    return embed;
};
