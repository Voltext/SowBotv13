const got = require('got');
require('dotenv').config()

const makeURL = () => `https://discord.com/api/channels/1020265346877374534/threads`;

class Thread {
    async insertThreadForum(message, name) {
      requestOptions = [
        {
          headers: {
            'Authorization': 'Bot ' + process.env.BOT_TOKEN,
            'Content-Type': "application/json"
          },
            method: "POST",
            form: true,
            body: {
              message : {
                content: message
            },
            name: name
            }
        }
    ];
        const res = await got(makeURL(), requestOptions)

        if (!res || !res.body) {
            throw new Error('Il y a une erreur dans la requête.')
        }
        return res.body;
    }
}

module.exports = Thread;