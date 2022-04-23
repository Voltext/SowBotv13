const {
    CommandInteraction,
    MessageEmbed,
    Collection,
    CommandInteractionOptionResolver
} = require("discord.js");
const mongo = require('../../mongo');
const reponseSchema = require('../../Schemas/reponseSchema');
const battleSchema = require('../../Schemas/battleSchema');
const pronoSchema = require('../../Schemas/pronoSchema');
const counterSchema = require('../../Schemas/counterSchema');
const Util = require('../../Utils/function')

module.exports = {
    name: "battle",
    description: "Gérer les battle",
    permissions: "KICK_MEMBERS",
    options: [{
            name: "reset",
            type: "SUB_COMMAND",
            description: "Reset les battle, reponses et pronos",
        },
        {
            name: "prono",
            type: "SUB_COMMAND",
            description: "Créer un pronostique",
            options: [{
                    name: "texte",
                    type: "STRING",
                    required: true,
                    description: "Saisissez un pronostique"
                },
                {
                    name: "max",
                    type: "NUMBER",
                    required: true,
                    description: "Saisissez la valeur max"
                },
                {
                    name: "isperfect",
                    type: "STRING",
                    required: true,
                    description: "Saisissez oui ou non",
                    choices: [{
                            name: "Oui",
                            value: "oui"
                        },
                        {
                            name: "Non",
                            value: "non"
                        }
                    ]
                },
                {
                    name: "ecart",
                    type: "NUMBER",
                    required: false,
                    description: "Saisissez les points perdu par ecart"
                },
            ]
        },
        {
            name: "results",
            type: "SUB_COMMAND",
            description: "Changez le nom de votre salon",
            options: [{
                    name: "result1",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 1"
                },
                {
                    name: "result2",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 2"
                },
                {
                    name: "result3",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 3",
                },
                {
                    name: "result4",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 4"
                },
                {
                    name: "result5",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 5"
                },
                {
                    name: "result6",
                    type: "STRING",
                    required: true,
                    description: "Saisissez la réponse 6"
                },
            ]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const {
            options,
            member,
            guild
        } = interaction;

        const subCommand = options.getSubcommand();
        const players = new Collection();

        switch (subCommand) {
            case "reset": {
                await mongo().then(async (mongooseresetprono) => {
                    try {
                        await pronoSchema.deleteMany({})
                    } finally {
                        mongooseresetprono.connection.close()
                    }
                })
                await mongo().then(async (mongooseresetbattle) => {
                    try {
                        await battleSchema.deleteMany({})
                    } finally {
                        mongooseresetbattle.connection.close()
                    }
                })
                await mongo().then(async (mongooseresetreponse) => {
                    try {
                        await reponseSchema.deleteMany({})
                    } finally {
                        mongooseresetreponse.connection.close()
                    }
                })
                await mongo().then(async (mongooseresetcounter) => {
                    try {
                        await counterSchema.deleteMany({})
                    } finally {
                        mongooseresetcounter.connection.close()
                    }
                })
                const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Battle reset")
                    .setDescription("Le système de Battle a été reset.")

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
                break;
            }
            case "prono": {
                const libelle = options.getString("texte")
                const max = options.getNumber("max")
                const ecart = options.getNumber("ecart")
                const isPerfect = options.getString("isperfect")
                let arr = []

                if (isPerfect === "oui") {
                    arr = [{
                        libelle: libelle,
                        pointMax: max,
                        isPerfect: true
                    }]
                } else {
                    arr = [{
                        libelle: libelle,
                        pointMax: max,
                        ecart: ecart,
                        isPerfect: false
                    }]
                }

                await mongo().then(async (mongoosseaddprono) => {
                    try {
                        await pronoSchema.insertMany(arr);
                    } catch (error) {
                        console.log(error)
                        mongoosseaddprono.connection.close()
                    }
                })
                const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Prono crée")
                    .setDescription("Le pronostique a bien été crée et assigné.")

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
                break
            }
            case "results": {
                const resultone = options.getString("result1")
                const resulttwo = options.getString("result2")
                const resultthree = options.getString("result3")
                const resultfour = options.getString("result4")
                const resultfive = options.getString("result5")
                const resultsix = options.getString("result6")

                const arr = [resultone, resulttwo, resultthree, resultfour, resultfive, resultsix]

                await mongo().then(async (mongooserank) => {
                    try {
                        const results = await pronoSchema.aggregate([{
                                $lookup: {
                                    from: "reponses",
                                    localField: "id",
                                    foreignField: "pronoId",
                                    as: "prono_reponses",
                                },
                            },
                            // Deconstructs the array field from the
                            // input document to output a document
                            // for each element
                        ])
                        if (results === null) {
                            interaction.reply({
                                content: "Aucune réponse n'a été envoyée. Impossible d'afficher le résultat",
                                ephemeral: true
                            })
                        } else {
                            results.forEach(async elem => {
                                const allReponses = elem.prono_reponses
                                allReponses.forEach(async r => {
                                    if (elem.isPerfect === true) {
                                        console.log(arr)
                                        console.log(arr[r.pronoId - 1])
                                        if (Util.cleanVar(r.reponse).toLowerCase() === arr[r.pronoId - 1].toLowerCase()) {
                                            if(!players.get(r.userId)) {
                                                players.set(r.userId, elem.pointMax)
                                                console.log(players.get(r.userId))
                                            }
                                            else {
                                                const actualPoint = players.get(r.userId) + elem.pointMax
                                                console.log(actualPoint)
                                                players.set(r.userId, actualPoint)
                                            }
                                        }
                                    } 
                                    else {
                                        const ecart = (parseInt(Util.cleanVar(r.reponse)) - parseInt(arr[r.pronoId - 1]))
                                        const ptsPerdu = ecart * elem.ecart
                                        const ptsFinaux = elem.pointMax - ptsPerdu
                                        if(ptsFinaux > 0) {
                                            if(!players.get(r.userId)) {
                                                players.set(r.userId, ptsFinaux)
                                            }
                                            else {
                                                const actualPoint = players.get(r.userId) + ptsFinaux
                                                console.log(actualPoint)
                                                players.set(r.userId, actualPoint)
                                            }
                                        }
                                    }
                                })
                            })
                            console.log(players)
                        }


                    } catch {
                        mongooserank.connection.close();
                    }
                })
                break
            }
        }
    }
}