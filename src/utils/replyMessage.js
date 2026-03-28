/**
 * Reply to an interaction and return the channel Message (for collectors / timestamps).
 * Fixes broken `withResponse` chains that called `.fetchReply` on the wrong object.
 */
async function replyWithMessage(interaction, options) {
    const res = await interaction.reply({ ...options, withResponse: true });
    return res.resource?.message ?? interaction.fetchReply();
}

module.exports = { replyWithMessage };
