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
const Util = require('../../Utils/function')

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

            const today = Util.dateToMilliseconds(Moment().format("D/M/YYYY"))

            await mongo().then(async (mongoosenewabsence) => {
                try {
                    const results = await absenceSchema.findOne({
                        userId,
                    })

                    if (results !== null) {
                        if (results.date_depart <= today && results.date_retour > today)
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