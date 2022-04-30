  const mongo = require('../../mongo');
  const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')
  
  module.exports = {
    name: "link",
    description: "Link votre compte Twitch",
    options: [{
      name: 'username',
      description: "Twitch username",
      type: "STRING",
      required: true
    }, ],
  
    async execute(interaction) {

      const userName = interaction.options.getString("username")
      const userId = interaction.user.id

      await mongo().then(async (mongooselock) => {
        try {
            await linkTwitchSchema.findOneAndUpdate({
                userId,
            }, {
                userId,
                userName,
            }, {
                upsert: true,
            })
        } finally {
            mongooselock.connection.close()
        }
    })

    interaction.reply({
        content: `Votre compte Twitch -> ${userName} a bien été link à votre compte`,
        ephemeral: true
    })
      

  
    }
  }