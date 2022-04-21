const {
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
const Cards = require("../../Api/card");
const CardPatch = require("../../Api/cardFulfilled");
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const mongo = require('../../mongo');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')

module.exports = {
    name: "card",
    description: "Affiche les nouvelles recuperations",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        const {
            guild
        } = interaction

        const getUsers = new Cards()

        const card = await getUsers.getUserCard()
        if (card.data !== null) {
            const data = card.data

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
                            const userId = results.userId
                            const embed = new MessageEmbed()
                                .setTitle("Nouvelle demande de carte")
                                .setDescription(`${elem.user_name} vient de récupérer une carte ! Félicitations`);

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
                                } finally {
                                    mongooselock.connection.close()
                                }
                            })

                            const member = await guild.members.fetch(userId);

                            const image = await fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${chosenFile}`))
                            const attachmentBoost = new MessageAttachment(image)

                            await member.send({
                                embeds: [new MessageEmbed().setTitle("Nouvelle carte débloquée").setImage(`attachment://${chosenFile}`)],
                                files: [attachmentBoost]
                            })

                            guild.channels.cache.get(process.env.ADMIN_FEED).send({
                                content: chosenFile,
                                embeds: [embed]
                            })
                        }
                    } finally {
                        mongoosepredi.connection.close();
                    }
                });

                fetch(`https://api.twitch.tv/helix/channel_points/custom_rewards?id=dd830257-d211-41fa-9c41-89472c032a9f&broadcaster_id=727375071?reward_id=${elem.id}`, {
                        method: 'PATCH',
                        headers: {
                            'content-Type': 'application/json',
                            'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
                            'client-id': process.env.CLIENT_ID_SOW
                        },
                        body: JSON.stringify({ "status" : "FULFILLED" })
                    }).then(response => response.json())
                    .then((data) => console.log("FULFILLED"))
                    .catch(error => console.error(JSON.stringify(error)))

            })

        } else {
            interaction.reply({
                content: "Aucune demande de carte n'a été faites récemment"
            })
        }
    }
}