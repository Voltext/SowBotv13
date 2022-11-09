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
            const userId = interaction.message.embeds.footer
            const etat = "Validée"
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
                        /* .addFields({
                            name: 'Date départ',
                            value: date_depart,
                            inline: true
                        }, {
                            name: 'Date Retour',
                            value: date_retour,
                            inline: true
                        }, {
                            name: 'Raison',
                            value: raison,
                            inline: true
                        }, ) */
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