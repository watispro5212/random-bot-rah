const OWNER_ID = '1320058519642177668';

function isOwner(userId) {
    return userId === OWNER_ID;
}

module.exports = { OWNER_ID, isOwner };
