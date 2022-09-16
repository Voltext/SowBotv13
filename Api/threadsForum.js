const got = require('got');
require('dotenv').config()

const makeURL = () => `https://discord.com/api/channels/1020265346877374534/threads`;

class Thread {
    async insertThreadForum(message, name) {
        const res = await got.post(makeURL(), {
             headers: {
                 'Authorization': 'Bot ' + process.env.BOT_TOKEN,
                 'Content-Type': "application/json"
             },
             body: {
              message : {
                  content: message
              },
              name: name
          },
          json: true,
          responseType: 'json'
        })

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = Thread;