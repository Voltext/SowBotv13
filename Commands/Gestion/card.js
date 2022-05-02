const Cards = require("../../Api/card");
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const mongo = require('../../mongo');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')
const axios = require('axios')

module.exports = {
    name: "card",
    description: "Affiche les nouvelles recuperations",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        const {
            guild
        } = interaction

        const getUsers = new Cards()

        const ArrId = []

        const card = await getUsers.getUserCard()
        if (card.data !== null) {
            const data = card.data
            console.log(data)

            data.forEach(async function (elem) {
                const userName = elem.user_name

                await mongo().then(async (mongoosepredi) => {
                    try {
                        const results = await linkTwitchSchema.findOne({
                            userName,
                        });
                        if (results === null) {
                            guild.channels.cache.get(process.env.ADMIN_FEED).send({
                                content: `Le compte ${userName} n'est link à aucun compte`,
                            })
                        } else {
                            const rewardId = elem.id;
                            const userId = results.userId

                            const files = fs.readdirSync(path.join(__dirname, `../../Assets/Cards/`))
                            let chosenFile = files[Math.floor(Math.random() * files.length)]

                            await mongo().then(async (mongooselock) => {
                                try {
                                    await cardCollectionSchema.findOneAndUpdate({
                                        userId,
                                    }, {
                                        userId,
                                        $push: {
                                            cards: [chosenFile],
                                        },
                                    }, {
                                        upsert: true,
                                    })

                                } catch {
                                    mongooselock.connection.close()
                                }
                            })
                            headers = {
                                'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                                'Client-Id': process.env.CLIENT_ID_SOW,
                                'Content-Type': 'application/json'
                            }

                            dataCards = {
                                'status': 'FULFILLED'
                            }

                            axios.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?id=${rewardId}&broadcaster_id=727375071&reward_id=dd830257-d211-41fa-9c41-89472c032a9f`, dataCards, {
                                'headers': headers
                            }).then(resp => {
                                console.log(resp.data);
                            }).catch(err => console.error(err))
                            /* axios.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?id=${rewardId}&broadcaster_id=727375071&reward_id=dd830257-d211-41fa-9c41-89472c032a9f`, {
                                "status": "FULFILLED"
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                                    'client-id': process.env.CLIENT_ID_SOW,
                                    'Content-Type': 'application/json'
                                }
                            }) */
                        }
                    } catch {
                        mongoosepredi.connection.close();
                    }
                });

            })

        } else {
            interaction.reply({
                content: "Aucune demande de carte n'a été faites récemment"
            })
        }
    }
}