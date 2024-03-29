const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const mongo = require('../../mongo');
const absenceSchema = require('../../Schemas/absenceSchema');
const Moment = require("moment");
const Util = require('../../Utils/function')

module.exports = {
    name: "absence",
    description: "Permet de gérer les absences",
    permission: "KICK_MEMBERS",
    options: [{
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
            }, ]
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
        Moment.locale("fr");
        const {
            guild,
            options
        } = interaction
        const raison = interaction.options.getString('raison');
        const debut = interaction.options.getString('date_depart');
        const fin = interaction.options.getString('date_retour');

        const etat = "En attente";

        const userId = interaction.user.id;
        const userName = interaction.user.username;

        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case "new": {
                await mongo().then(async (mongoosenewabsence) => {
                    try {
                        const results = await absenceSchema.findOne({
                            userId,
                        })

                        if (results !== null) {
                            interaction.reply({
                                embeds: [new MessageEmbed().setTitle("Absence déjà en cours").setDescription("Veuillez attendre la fin de votre absence en cours avant d'en demander une nouvelle")],
                                ephemeral: true
                            })
                        } else {
                            if (Moment(debut, 'DD/MM/YYYY', true).isValid() === false || Moment(fin, 'DD/MM/YYYY', true).isValid() === false) {
                                interaction.reply({
                                    embeds: [new MessageEmbed().setTitle("Format date incorrect").setDescription("Merci d'indiquer la date de vos absences sous le format : DD/MM/YYYY")],
                                    ephemeral: true
                                })
                                return
                            }

                            const date_depart = Util.dateToMilliseconds(debut)
                            const date_retour = Util.dateToMilliseconds(fin)

                            await mongo().then(async (mongoosenewabsence) => {
                                try {
                                    await absenceSchema.create({
                                        userId,
                                        raison,
                                        date_depart,
                                        date_retour,
                                        etat
                                    })
                                    const embed = new MessageEmbed()
                                        .setTitle("Demande d'absence déposée")
                                        .setDescription("Ta demande d'absence a bien été envoyé aux responsables. Vous recevrez une notification une fois l'absence validée ou refusé.")
                                        .addFields({
                                            name: 'Date départ',
                                            value: debut,
                                            inline: true
                                        }, {
                                            name: 'Date Retour',
                                            value: fin,
                                            inline: true
                                        }, {
                                            name: 'Raison',
                                            value: raison,
                                            inline: true
                                        }, )
                                    interaction.reply({
                                        embeds: [embed],
                                        ephemeral: true
                                    })
                                    const valide = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton()
                                            .setCustomId('valideAbsence')
                                            .setLabel('Valider')
                                            .setStyle('SUCCESS'),
                                            new MessageButton()
                                            .setCustomId('refusAbsence')
                                            .setLabel('Refuser')
                                            .setStyle('DANGER'),
                                        );
                                    guild.channels.cache.get(process.env.DEMANDES).send({
                                        embeds: [new MessageEmbed().setTitle("Nouvelle demande d'absence").setDescription("Nouvelle demande d'absence enregistrée. Utilisez les bouton ci-dessous pour la gérer").addFields({
                                            name: 'Pseudo',
                                            value: userName,
                                            inline: true
                                        }, {
                                            name: "Date d'absence",
                                            value: 'Du ' + debut + ' au ' + fin,
                                            inline: true
                                        }, {
                                            name: 'Raison',
                                            value: raison,
                                            inline: true
                                        }, ).setFooter({
                                            text: userId
                                        })],
                                        components: [valide]
                                    })
                                } catch (err) {
                                    console.log(err)
                                    console.log("Erreur commande absence: absence(137)")
                                    mongoosenewabsence.connection.close()
                                }
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
}