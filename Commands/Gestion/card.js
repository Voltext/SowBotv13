const {
    MessageEmbed
} = require("discord.js");
const Cards = require("../../Api/card");
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

            data.forEach(function (elem) {
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
                            guild.channels.cache.get(process.env.ADMIN_FEED).send({
                                content: chosenFile,
                                embeds: [embed]
                            })
                        }
                    } finally {
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