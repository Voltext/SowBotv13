const {
    CommandInteraction,
    MessageEmbed,
    Collection
} = require("discord.js");
const mongo = require('../../mongo');
const battleSchema = require('../../Schemas/battleSchema');
const pronoSchema = require('../../Schemas/pronoSchema');
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
            name: "create",
            type: "SUB_COMMAND",
            description: "Create Battle",
            options: [{
                name: "user1",
                type: "USER",
                required: true,
                description: "Saisissez la réponse 1"
            },
            {
                name: "user2",
                type: "USER",
                required: true,
                description: "Saisissez la réponse 2"
            },
            {
                name: "user3",
                type: "USER",
                required: false,
                description: "Saisissez la réponse 3"
            },
            {
                name: "user4",
                type: "USER",
                required: false,
                description: "Saisissez la réponse 4"
            },
        ]
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
            guild
        } = interaction;

        const subCommand = options.getSubcommand();
        const players = new Collection();
        const winners = new Collection();

        switch (subCommand) {
            case "reset": {
                Util.clearAll();
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
                        console.log("Erreur commande battle: battle(187)")
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
                            results.forEach(async (elem) => {
                                    const allReponses = elem.prono_reponses;
                                    allReponses.forEach(async (r) => {
                                        if (elem.isPerfect === true) {
                                            if (Util.cleanVar(r.reponse).toLowerCase() === arr[r.pronoId - 1].toLowerCase()) {
                                                if (!players.get(r.userId)) {
                                                    players.set(r.userId, elem.pointMax);
                                                } else {
                                                    const actualPoint = players.get(r.userId) + elem.pointMax;
                                                    players.set(r.userId, actualPoint);
                                                }
                                            } else {
                                            }
                                        } else {
                                            const ecart = Util.difference(parseInt(Util.cleanVar(r.reponse)), parseInt(arr[r.pronoId - 1]));
                                            const ptsPerdu = ecart * elem.ecart;
                                            const ptsFinaux = elem.pointMax - ptsPerdu;
                                            if (ptsFinaux > 0) {
                                                if (!players.get(r.userId)) {
                                                    players.set(r.userId, ptsFinaux);
                                                } else {
                                                    let actualPoint = players.get(r.userId) + ptsFinaux;
                                                    players.set(r.userId, actualPoint);
                                                    actualPoint = 0;
                                                }
                                            }
                                        }
                                    });
                                })
                            await mongo().then(async (mongooserank) => {
                                try {
                                    const results = await battleSchema.find({}, {
                                        userId1: 1,
                                        userId2: 1,
                                        id: 1,
                                        _id: 0
                                    });
                                    if (results === null) {
                                        interaction.reply({
                                            content: "Aucune Battle en cours",
                                            ephemeral: true
                                        })
                                    } else {
                                        const embed = new MessageEmbed();
                                        results.forEach(async battle => {
                                            embed.setTitle(`Vainqueur de sa battle`);
                                            if (players.get(battle.userId1) > players.get(battle.userId2)) {
                                                const memberonew = await guild.members.fetch(battle.userId1);
                                                const membertwol = await guild.members.fetch(battle.userId2);
                                                embed.setDescription(`Félicitations à ${memberonew.user.username} qui gagne son duel sur ${membertwol.user.username}!`)
                                                    .setFooter({
                                                        text: `${memberonew.user.username} gagne sur le score de ${players.get(battle.userId1)} - ${players.get(battle.userId2)}`
                                                    })
                                                winners.set(battle.id, battle.userId1)
                                            } else {
                                                const memberonel = await guild.members.fetch(battle.userId1);
                                                const membertwow = await guild.members.fetch(battle.userId2);
                                                embed.setDescription(`Félicitations à ${membertwow.user.username} qui gagne son duel sur ${memberonel.user.username}!`)
                                                    .setFooter({
                                                        text: `${membertwow.user.username} gagne sur le score de ${players.get(battle.userId2)} - ${players.get(battle.userId1)}`
                                                    })
                                                winners.set(battle.id, battle.userId1)
                                            }
                                            guild.channels.cache.get(process.env.BATTLE_TEXT).send({
                                                embeds: [embed]
                                            })
                                        })
                                    }
                                } catch {
                                    console.log("Erreur commande battle: battle(303)")
                                    mongooserank.connection.close();
                                }
                            })
                        }
                    } catch {
                        console.log("Erreur commande battle: battle(309)")
                        mongooserank.connection.close();
                    }
                })
                break
            }
            case "create": {

                const userone = interaction.options.getMember("user1")
                const usertwo = interaction.options.getMember("user2")
                const userthree = interaction.options.getMember("user3")
                const userfour = interaction.options.getMember("user4")


                const channel = await guild.channels.fetch(process.env.BATTLE_TEXT);
                channel.messages.fetch().then((messages) => {
                    messages.forEach(m => {
                        if (m.content === "#BATTLE") {
                            m.delete();
                        }
                    })
                })


                var newBattle = []    

                if(userthree) {
                    newBattle = [{
                        id: 1,
                        userId1: userone.user.id,
                        userId2: usertwo.user.id
                    }, {
                        id: 2,
                        userId1: userthree.user.id,
                        userId2: userfour.user.id
                    }]
                }
                else {
                    newBattle = [{
                        id: 1,
                        userId1: userone.user.id,
                        userId2: usertwo.user.id
                    }]
                }

                

                await mongo().then(async (mongoosseaddbattle) => {
                    try {
                        await battleSchema.insertMany(newBattle);
                    } catch (error) {
                        console.log("Erreur commande battle: battle(361)")
                        mongoosseaddbattle.connection.close()
                    }
                }) 

                var members = ""
                var balls = ""

                if(userthree) {
                    members = `${userone.user.username}\n${usertwo.user.username}\n${userthree.user.username}\n${userfour.user.username}`
                    balls = "🔴\n🔴\n🔴\n🔴";
                }
                else {
                    members = `${userone.user.username}\n${usertwo.user.username}`
                    balls = "🔴\n🔴";
                }

                const battleEmbed = new MessageEmbed()
                .setColor("GOLD")
                .setTitle(`BATTLE`)
                .setDescription(`Félicitations pour votre qualification pour les battle. Vous trouverez ci-dessous, les battle, ainsi que vos adversaires. Bonne chance à tous !`);
                battleEmbed.addFields({
                    name: 'Réponse ?',
                    value: balls,
                    inline: true
                }, {
                    name: '❯ Joueurs',
                    value: members,
                    inline: true
                },);
                battleEmbed.setFooter({text: "Lorsqu'un joueur enverra sa réponse, son pseudo passera en vert"})
                guild.channels.cache.get(process.env.BATTLE_TEXT).send({
                    content: "#BATTLE",
                    embeds: [battleEmbed]
                })
                break;
            }
        }
    }
}