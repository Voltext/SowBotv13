const got = require('got');
require('dotenv').config()

const makeURL = () => `https://api.twitch.tv/helix/streams?user_login=sowdred`;

class TwitchLive {
    async isLive() {
        const res = await got(makeURL(), {
             headers: {
                 'Authorization': 'Bearer ' + process.env.TWITCH_AUTH,
                 'Client-Id': process.env.CLIENT_ID
             },
             responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = TwitchLive;