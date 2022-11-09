const {
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Client
} = require('discord.js');
const mongo = require('../../mongo');
const absenceSchema = require('../../Schemas/absenceSchema');
const Moment = require("moment");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        Moment.locale("fr");
        const {
            content,
            guild,
            author,
            channel
        } = message
        if (message.author.bot) return

        if (message.mentions.members.first()) {
            const member = message.mentions.members.first()
            const userId = member.user.id
            const userName = member.user.username

            let today = new Date().toJSON().slice(0,10).replace(/-/g,'/');

            today = new Date(today)

            await mongo().then(async (mongoosenewabsence) => {
                try {
                    const results = await absenceSchema.findOne({
                        userId,
                        "date_debut": {
                            $lte: today
                        }, 
                        "date_retour": {
                            $gte: today
                        },
                    })

                    if (results !== null) {
                        if (debut.isBefore(today) === false && fin.isAfter(today) === false)
                            message.reply({
                                content: userName + " est actuellement absent. Merci de ne pas l'identifier, il ne répondra pas à vos message jusqu'au " + results.date_retour
                            })
                    }
                } catch (err) {
                    console.log(err)
                    console.log("Erreur commande bannissement: ban(91)")
                    mongoosenewabsence.connection.close()
                }
            })
        }


    }
}