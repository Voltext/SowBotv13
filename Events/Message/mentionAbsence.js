const {
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Client
  } = require('discord.js');
  
  module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const {
            content,
            guild,
            author,
            channel
          } = message
      if (message.author.bot) return
  
      if(message.mentions.members.first()) {
        const userId = message.mentions.members.id
        await mongo().then(async (mongoosenewabsence) => {
            try {
                const results = await absenceSchema.findOne({
                    userId,
                })
                if (results !== null) { 
                    message.reply({
                        content: message.mentions.members.username + " est actuellement absent. Merci de ne pas l'identifier, il ne répondra pas à vos message jusqu'au " + results.date_retour
                    })
                }
            } catch (err){
                console.log(err)
                console.log("Erreur commande bannissement: ban(91)")
                mongoosenewabsence.connection.close()
            }
        })
      }
  
        
    }
  }