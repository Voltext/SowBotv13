const { MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const absenceSchema = require('../../Schemas/absenceSchema');

module.exports = {
    name: "absence",
    description: "Permet de gérer les absences",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "list",
            type: "SUB_COMMAND",
            description: "Affichez la liste des absences",
          },
          {
            name: "details",
            type: "SUB_COMMAND",
            description: "Detail d'une absence",
            options: [{
                name: "member",
                type: "USER",
                required: true,
                description: "Saisissez l'@ du membre que vous souhaitez vérifié"
              },
            ]
          },
          {
            name: "new",
            type: "SUB_COMMAND",
            description: "Ajoutez une absence",
            options: [{
                name: "raison",
                type: "STRING",
                required: true,
                description: "La raison de votre absence"
              },
              {
                name: "date_depart",
                type: "STRING",
                required: true,
                description: "Date de départ"
              },
              {
                name: "date_retour",
                type: "STRING",
                required: true,
                description: "Date de retour"
              },
            ]
          },
    ],

    async execute(interaction) {
        const {guild, options} = interaction
        const raison = interaction.options.getString('raison');
        const date_depart = interaction.options.getString('date_depart');
        const date_retour = interaction.options.getString('date_retour');

        const userId = interaction.user.id;

        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case "new": {
                await mongo().then(async (mongoosenewabsence) => {
                    try {
                        await absenceSchema.findOneAndUpdate({
                            userId,
                        }, {
                            raison,
                            date_depart,
                            date_retour,
                        }, {
                            upsert: true,
                        })
                        const embed = new MessageEmbed()
                        .setTitle("Demande d'absence déposée")
                        .setDescription("Ta demande d'absence a bien été envoyé aux responsables. Vous recevrez une notification une fois l'absence validée ou refusé.")
                        .addFields(
                            { name: 'Date départ', value: date_depart, inline: true },
                            { name: 'Date Retour', value: date_retour, inline: true },
                            { name: 'Raison', value: raison, inline: true },
                        )
                        interaction.reply({
                            embeds: [embed]
                        })
                    } catch {
                        console.log("Erreur commande bannissement: ban(91)")
                        mongoosenewabsence.connection.close()
                    } 
                })
            }
        }
    }
}