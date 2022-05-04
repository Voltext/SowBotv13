const got = require('got');
require('dotenv').config()

const makeURL = () => `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=727375071&reward_id=dd830257-d211-41fa-9c41-89472c032a9f&status=UNFULFILLED&sort=NEWEST&first=50`;

class Card {
    async getUserCard() {
        const res = await got(makeURL(), {
             headers: {
                 'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                 'client-id': process.env.CLIENT_ID_SOW
             },
             responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = Card;