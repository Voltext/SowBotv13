const got = require('got');
require('dotenv').config()

const makeURL = query => `https://api.twitch.tv/helix/channel_points/custom_rewards?id=dd830257-d211-41fa-9c41-89472c032a9f&broadcaster_id=727375071?reward_id=${encodeURIComponent(
    query,
)}`;

class CardPatch {
    async patchEvent(query) {
        const res = await got(makeURL(query), {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                'client-id': process.env.CLIENT_ID_SOW,
                'content-Type': 'application/json',
            },
            body: JSON.stringify({ "status" : "FULFILLED" })
        })

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = CardPatch;