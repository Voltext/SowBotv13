const {
    MessageAttachment,
    MessageEmbed
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const {
    Pagination
} = require('pagination.djs');
const fs = require('fs')
const path = require('path');

module.exports = {
    name: "admincards",
    description: "Récupère ta carte",

    async execute(interaction) {

        const pagination = new Pagination(interaction);

        const userId = interaction.user.id
        var ArrEmb = []
        var ArrImg = []

        await mongo().then(async (mongoosepredi) => {
            try {
                const results = await cardCollectionSchema.findOne({
                    userId,
                });
                if (results === null) {

                } else {
                    const ArrCards = results.cards

                    ArrCards.forEach(function (elem) {
                        const embed = new MessageEmbed().setImage(`http://141.94.78.72/Cards/${elem}`)

                        ArrEmb.push(embed)
                    })

                    pagination.setEmbeds(ArrEmb);
                    pagination.render();
                }
            } catch {
                console.log("Erreur affichage pagination cards : admincards(46)")
                mongoosepredi.connection.close();
            }
        })

    }
}