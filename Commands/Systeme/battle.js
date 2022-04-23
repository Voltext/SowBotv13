const {
    CommandInteraction,
    MessageEmbed,
    Collection
} = require("discord.js");
const mongo = require('../../mongo');
const reponseSchema = require('../../Schemas/reponseSchema');
const battleSchema = require('../../Schemas/battleSchema');
const pronoSchema = require('../../Schemas/pronoSchema');
const counterSchema = require('../../Schemas/counterSchema');
const { collection } = require("../../Schemas/reponseSchema");

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

                    const players = new Collection();


                    await mongo().then(async (mongooserank) => {
                            try {
                                const results = await pronoSchema.aggregate([
                                    {
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
                                    if(results === null) {
                                        interaction.reply({
                                            content: "Aucune réponse n'a été envoyée. Impossible d'afficher le résultat",
                                            ephemeral: true
                                        })
                                    }
                                    else {
                                        results.forEach(async elem => {
                                            const allReponses = elem.prono_reponses
                                            allReponses.forEach(async r => {
                                                console.log("1")
                                                if(!players.get(r.userId)) {
                                                    console.log("2")
                                                    if(elem.isPerfect === true) {
                                                        console.log(r.reponse.toLowerCase())
                                                        console.log(` ${resultone}\n`)
                                                        if(r.reponse.toLowerCase() === ` ${resultone}\n`) {
                                                            console.log("4")
                                                            players.set(r.userId, elem.pointMax)
                                                            console.log(players.get(r.userId))
                                                        }
                                                    }
                                                }
                                            })
                                        })
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