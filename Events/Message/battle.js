const {
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Client
} = require('discord.js');
const mongo = require('../../mongo');
const reponseSchema = require('../../Schemas/reponseSchema');
const battleSchema = require('../../Schemas/battleSchema');
const pronoSchema = require('../../Schemas/pronoSchema');

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        if (message.channel.type === 'DM') {
            const {
                content
            } = message

            if (content.startsWith("#BATTLE")) {
                const answers = content.split("-");
                answers.shift()
                const arr = [{userId: message.author.id, pronoId: 1, reponse: answers[0]}, {userId: message.author.id, pronoId: 2, reponse: answers[1]}, {userId: message.author.id, pronoId: 3, reponse: answers[2]}, {userId: message.author.id, pronoId: 4, reponse: answers[3]}, {userId: message.author.id, pronoId: 5, reponse: answers[4]}, {userId: message.author.id, pronoId: 6, reponse: answers[5]}]

                const userId = message.author.id

                await mongo().then(async (mongoosefindbattle) => {
                    try {
                        const results = await battleSchema.findOne({
                            $or: [{
                                    userId1: userId
                                },
                                {
                                    userId2: userId
                                }
                            ]
                        });
                        if (results === null) {
                            message.reply("Cette action est impossible car vous n'êtes pas qualifié pour les Battle.")
                        } else {
                            await mongo().then(async (mongoosefindreponse) => {
                                try {
                                    const results = await reponseSchema.findOne({
                                        $or: [{
                                            userId: userId
                                        }]
                                    });
                                    if (results === null) {
                                        if (answers.length !== 6) {
                                            message.reply(`Vous n'avez pas donné suffisament de réponse. Vous avez donné ${answers.length}/6 reponses`)
                                        } else {
                                            await mongo().then(async (mongoosseaddreponse) => {
                                                try {
                                                    await reponseSchema.insertMany(arr);
                                                    message.reply("Votre participation a bien été pris en compte.")
                                                    let listPseudo = ''
                                                    let listEmoji = ''

                                                    const channel = await client.channels.fetch(process.env.BATTLE_TEXT);
                                                    //const pseudos = message.embeds[0].fields
                                                    channel.messages.fetch().then((messages) => {
                                                        messages.forEach(m => {
                                                            if (m.content === "#BATTLE") {
                                                                const fields = m.embeds[0].fields[1]
                                                                const title = m.embeds[0].title
                                                                for (const [key, value] of Object.entries(fields)) {
                                                                    if (key === "value") {
                                                                        const pseudos = value.split("\n");
                                                                        pseudos.forEach(element => {
                                                                            listPseudo = listPseudo + element + '\n'
                                                                            if (message.author.username === element) {
                                                                                listEmoji = listEmoji + '🟢 \n'
                                                                            } else {
                                                                                listEmoji = listEmoji + '🔴 \n'
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                const battleEmbed = new MessageEmbed()
                                                                    .setColor("GOLD")
                                                                    .setTitle(title)
                                                                    .setDescription(`Félicitations pour votre qualification pour les battle. Vous trouverez ci-dessous, les battle, ainsi que vos adversaires. Bonne chance à tous !`);
                                                                battleEmbed.addFields({
                                                                    name: 'Réponse ?',
                                                                    value: listEmoji,
                                                                    inline: true
                                                                }, {
                                                                    name: '❯ Joueurs',
                                                                    value: listPseudo,
                                                                    inline: true
                                                                }, );
                                                                battleEmbed.setFooter({
                                                                    text: "Lorsqu'un joueur enverra sa réponse, son pseudo passera en vert"
                                                                });
                                                                m.edit({
                                                                    embeds: [battleEmbed]
                                                                })
                                                            }
                                                        })
                                                    })

                                                } catch (error) {
                                                    mongoosseaddreponse.connection.close()
                                                }
                                            })
                                        }
                                    } else {
                                        message.reply("Vous avez déjà envoyé votre participation")
                                    }

                                } finally {
                                    mongoosefindreponse.connection.close()
                                }
                            })

                        }
                    } finally {
                        mongoosefindbattle.connection.close();
                    }
                });
            }
        }
    }
}