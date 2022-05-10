const got = require('got');
require('dotenv').config()

//727375071
const makeURL = () => `https://api.twitch.tv/helix/schedule?broadcaster_id=727375071`;

class TwitchSchedule {
    async Schedule() {
        const res = await got(makeURL(), {
             headers: {
                 'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                 'Client-Id': process.env.CLIENT_ID_SOW
             },
             responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = TwitchSchedule;