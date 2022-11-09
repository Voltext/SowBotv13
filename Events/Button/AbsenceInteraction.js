const {
    MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const absenceSchema = require('../../Schemas/absenceSchema');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const {guild} = interaction
        if (interaction.isButton()) {
           if(interaction.customId === 'valideAbsence') {
            const userId = interaction.message.embeds[0].footer.text
            const etat = "Validée"

            const member = await guild.members.fetch(userId);
            console.log(member)

            await mongo().then(async (mongoosenewabsence) => {
                try {
                    const results = await absenceSchema.findOneAndUpdate({
                        userId,
                    }, {
                        etat
                    }, {
                        upsert: true,
                    })
                    console.log(results)
                    const embed = new MessageEmbed()
                        .setTitle("Demande d'absence validée")
                        .setDescription("La demande d'absence a bien été validée.")
                        .setColor("GREEN")
                        .addFields({
                            name: 'Modérateur',
                            value: results.userId,
                            inline: true
                        }, {
                            name: "Date d'absence",
                            value: "Du " + date_depart + " au " + date_retour,
                            inline: true
                        }, {
                            name: 'Raison',
                            value: raison,
                            inline: true
                        }, )
                        guild.channels.cache.get('899025666736021504').send({
                        embeds: [embed]
                    })
                } catch (err){
                    console.log(err)
                    console.log("Erreur commande bannissement: ban(91)")
                    mongoosenewabsence.connection.close()
                }
            })
           }
        }
    }
}