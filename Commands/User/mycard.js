const {
    MessageEmbed,
    MessageAttachment,
    MessageButton
} = require("discord.js");
const fs = require('fs')
const path = require('path');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const mongo = require('../../mongo');
const {
    Pagination
} = require('pagination.djs');

module.exports = {
    name: "mycard",
    description: "Récupère ta carte",

    async execute(interaction) {

        const pagination = new Pagination(interaction);

        const userId = interaction.user.id
        var ArrEmb = []

        await mongo().then(async (mongoosepredi) => {
            try {
                const results = await cardCollectionSchema.findOne({
                    userId,
                });
                if (results === null) {
                    
                } else {
                    const ArrCards = results.cards

                    const embed = new MessageEmbed().setImage(`http://141.94.78.72/Cards/${userId}.png`)
                        
                    ArrEmb.push(embed)

                    ArrCards.forEach(function (elem) {
                        const embed = new MessageEmbed().setImage(`http://141.94.78.72/Cards/${elem}`)

                        ArrEmb.push(embed)
                    })

                    pagination.setEmbeds(ArrEmb);
                    pagination.render();
                }
            } catch {
                mongoosepredi.connection.close();
            }
        })

    }
}