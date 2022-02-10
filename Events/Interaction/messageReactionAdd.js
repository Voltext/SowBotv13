const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo')
const prediSchema = require('../../Schemas/prediSchema')
const rankPrediSchema = require('../../Schemas/rankPredictSchema');

function addPoint(client, userId, userName, points) {
    mongo().then(async (mongoose) => {
        try {
            await rankPrediSchema.findOneAndUpdate({
                userId,
                userName,
            }, {
                userId,
                userName,
                $inc: {
                    points: points,
                },
            }, {
                upsert: true,
            });
        } catch (error) {
            console.log(error)
            console.log(`${points} points n'ont pas pu être donné à ${userName}`)
            mongoose.connection.close()
        }
    })
}

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, member, client) {
        if (member.bot) return

        //
        //const { guild } = member;
        const embed = reaction.message.embeds[0];
        //const channel = guild.channels.cache.get(process.env.CLIP_FEED)

        if (reaction.message.channel.id === process.env.PREDICTIONS) {
            const msgId = reaction.message.id;
            const message = reaction.message;

            //console.log(fields)
            //const fieldValue = Object.values(fields)

            await mongo().then(async (mongoose) => {
                try {
                    const results = await prediSchema.findOne({
                        msgId,
                    });
                    const result = Object.values(results)
                    const status = result[2].status
                    const pronoType = message.embeds[0].author.name

                    let ModoRole = reaction.message.guild.roles.cache.get(process.env.MODO_ID);
                    let winner = [];

                    let team1 = "";
                    let team2 = "";

                    let points = 0;

                    let cote1 = 0
                    let cote2 = 0
                    let cote3 = 0

                    const fields = reaction.message.embeds[0].fields[1]
                    for (const [key, value] of Object.entries(fields)) {
                        if (key === "value") {
                            const cotes = value.split("\n");
                            cote1 = cotes[0]
                            cote2 = cotes[1]
                            cote3 = cotes[2]
                        }
                    }

                    const blockedParticipeEmbed = new MessageEmbed()
                        .setTitle('Prédiction impossible')
                        .setDescription(`Vous avez déjà selectionné un résultat pour cette prédiction. Vous pouvez selectionner qu'un seul choix par prédiction`)
                        .setColor('RED');

                    const winEmbed = new MessageEmbed()
                        .setTitle("Vous venez de remporter une prédiction !")
                        .setDescription("Vous venez de remporter une prédiction, Félicitation !");

                    const editEmbed = new MessageEmbed()
                        .setColor("BLUE")
                        .setDescription("Prediction terminée");

                    const adminWin = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("Pronostique terminé")
                        .setFooter(`Prédiction ${pronoType} : ${reaction.message.embeds[0].footer.text}`);

                    switch (pronoType) {
                        case "Buteur":
                            const buteur = reaction.message.embeds[0].footer
                            const matchButeur = reaction.message.embeds[0].title
                            editEmbed.setAuthor("Buteur")
                            editEmbed.setTitle(`Est-ce que ${buteur.text} sera buteur lors de ${matchButeur} ?`)
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", "Oui", true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", "Non", true)
                                points = cote2
                            }
                            break;
                        case "Score final":
                            const matchFinal = reaction.message.embeds[0].footer.text
                            team1 = matchFinal.split("-")[0];
                            team2 = matchFinal.split("-")[1];
                            editEmbed.setAuthor("Score final");
                            editEmbed.setTitle(`Laquelle de ses 2 équipes gagnera le match ? (${matchFinal})`);
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", `${team1}`, true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "❌") {
                                editEmbed.addField("Résultat :", `Match nul`, true)
                                points = cote2
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", `${team2}`, true)
                                points = cote3
                            }
                            break;
                        case "Buts":
                            const buts = reaction.message.embeds[0].footer
                            const matchButs = reaction.message.embeds[0].title
                            editEmbed.setAuthor("Buts");
                            editEmbed.setTitle(`Pensez-vous qu'il y aura ${buts.text} buts dans ${matchButs} ?`);
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", "Oui", true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", "Non", true)
                                points = cote2
                            }
                            break;
                        case "Score -45":
                            const match45 = reaction.message.embeds[0].footer.text;
                            team1 = match45.split("-")[0];
                            team2 = match45.split("-")[1];
                            editEmbed.setAuthor("Score -45min");
                            editEmbed.setTitle(`Laquelle de ces 2 équipes gagnera le match à la mi-temps ? (${match45})`);
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", `${team1}`, true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "❌") {
                                editEmbed.addField("Résultat :", `Match nul`, true)
                                points = cote2
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", `${team2}`, true)
                                points = cote3
                            }
                            break;
                        case "Score +45":
                            const match90 = reaction.message.embeds[0].footer.text;
                            team1 = match90.split("-")[0];
                            team2 = match90.split("-")[1];
                            editEmbed.setAuthor("Score +45min");
                            editEmbed.setTitle(`Laquelle de ces 2 équipes gagnera le match en seconde période ? (${match90})`);
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", `${team1}`, true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "❌") {
                                editEmbed.addField("Résultat :", `Match nul`, true)
                                points = cote2
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", `${team2}`, true)
                                points = cote3
                            }
                            break;
                        case "Cartons":
                            const cartons = reaction.message.embeds[0].footer
                            const matchCartons = reaction.message.embeds[0].title
                            editEmbed.setAuthor("Cartons");
                            editEmbed.setTitle(`Pensez-vous qu'il y aura ${cartons.text} cartons dans ${matchCartons}`);
                            if (reaction.emoji.name === "1️⃣") {
                                editEmbed.addField("Résultat :", "Oui", true)
                                points = cote1
                            }
                            if (reaction.emoji.name === "2️⃣") {
                                editEmbed.addField("Résultat :", "Non", true)
                                points = cote2
                            }
                            break;
                    }


                    message.guild.members.fetch(member.id).then(member => {
                        if (status === "close") {
                            reaction.users.remove(member)
                            if (reaction.emoji.name === "1️⃣" || reaction.emoji.name === "❌" || reaction.emoji.name === "2️⃣") {
                                const blockedEmbed1 = new MessageEmbed()
                                    .setTitle('Prédiction bloquée')
                                    .setDescription(`Cette prédiction est bloquée aux joueurs car le match a peut-être commencé et il n'est donc plus possible d'y participer`)
                                    .setColor('RED');
                                member.send({
                                    embeds: [blockedEmbed1]
                                });
                            }
                            return;
                        } else {
                            if (member.roles.cache.has(process.env.MODO_ID) === true) {
                                if (reaction.emoji.name === "1️⃣") {
                                    winEmbed.addField("Points remportés", `${points}`)
                                    reaction.users.fetch().then(user => {
                                        user.forEach(elem => {
                                            if (elem.bot) return
                                            if (elem.id === member.id) return
                                            addPoint(client, elem.id, elem.username, points)
                                            winner.push(elem.username)
                                        })
                                        editEmbed.addField("Gagnants :", winner.length.toString(), true)
                                        if (winner.length === 0) {
                                            adminWin.setDescription(`Aucun gagnant pour cette prédiction`)
                                        } else {
                                            adminWin.setDescription(`${points} points ont été donné à\`\`\`\\${winner}\n\`\`\``)
                                        }
                                        client.channels.cache.get(process.env.ADMIN_FEED).send({
                                            embeds: [adminWin]
                                        });
                                        client.channels.cache.get(process.env.PREDICTIONS).messages.delete(msgId);
                                        message.channel.send({
                                            embeds: [editEmbed]
                                        })
                                    })
                                }
                                if (reaction.emoji.name === "❌") {
                                    winEmbed.addField("Points remportés", `${points}`)
                                    reaction.users.fetch().then(user => {
                                        user.forEach(elem => {
                                            if (elem.bot) return
                                            if (elem.id === member.id) return
                                            addPoint(client, elem.id, elem.username, points)
                                            winner.push(elem.username)
                                        })
                                        editEmbed.addField("Gagnants :", winner.length.toString(), true)
                                        if (winner.length === 0) {
                                            adminWin.setDescription(`Aucun gagnant pour cette prédiction`)
                                        } else {
                                            adminWin.setDescription(`${points} points ont été donné à\`\`\`\\${winner}\n\`\`\``)
                                        }
                                        client.channels.cache.get(process.env.ADMIN_FEED).send({
                                            embeds: [adminWin]
                                        });
                                        client.channels.cache.get(process.env.PREDICTIONS).messages.delete(msgId);
                                        message.channel.send({
                                            embeds: [editEmbed]
                                        })
                                    })
                                }
                                if (reaction.emoji.name === "2️⃣") {
                                    winEmbed.addField("Points remportés", `${points}`)
                                    reaction.users.fetch().then(user => {
                                        user.forEach(elem => {
                                            if (elem.bot) return
                                            if (elem.id === member.id) return
                                            addPoint(client, elem.id, elem.username, points)
                                            winner.push(elem.username)
                                        })
                                        editEmbed.addField("Gagnants :", winner.length.toString(), true)
                                        if (winner.length === 0) {
                                            adminWin.setDescription(`Aucun gagnant pour cette prédiction`)
                                        } else {
                                            adminWin.setDescription(`${points} points ont été donné à\`\`\`\\${winner}\n\`\`\``)
                                        }
                                        client.channels.cache.get(process.env.ADMIN_FEED).send({
                                            embeds: [adminWin]
                                        });
                                        client.channels.cache.get(process.env.PREDICTIONS).messages.delete(msgId);
                                        message.channel.send({
                                            embeds: [editEmbed]
                                        })
                                    })
                                }
                            } else {
                                const userReactions = message.reactions.cache.filter(reactions => reactions.users.cache.has(member.id));
                                let nbValue = 0;

                                try {
                                    for (const allreaction of userReactions.values()) {
                                        nbValue = nbValue + 1;
                                        if (nbValue > 1) {
                                            if (reaction.emoji.name === "1️⃣") {
                                                reaction.users.remove(member)
                                            }
                                            if (reaction.emoji.name === "❌") {
                                                reaction.users.remove(member)
                                            }
                                            if (reaction.emoji.name === "2️⃣") {
                                                reaction.users.remove(member)
                                            }
                                            member.send({
                                                embeds: [blockedParticipeEmbed]
                                            });
                                        }
                                    }
                                } catch (error) {
                                    console.error('Failed to remove reactions.');
                                }
                            }
                        }
                    })
                } finally {
                    mongoose.connection.close();
                }
            });
        };
    }
}