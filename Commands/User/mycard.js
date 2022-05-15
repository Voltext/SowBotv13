const {
    MessageEmbed,
    MessageAttachment,
    MessageButton
} = require("discord.js");
const fs = require('fs')
const path = require('path');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const mongo = require('../../mongo');
const paginationEmbed = require('discordjs-button-pagination')

module.exports = {
    name: "mycard",
    description: "Récupère ta carte",

    async execute(interaction) {

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

        await mongo().then(async (mongoosepredi) => {
            try {
                const results = await cardCollectionSchema.findOne({
                    userId,
                });
                if (results === null) {
                    nbCards = 1
                }
                else {
                    nbCards = results.cards.length
                }
                await interaction.reply({
                    content: `${nbCards}/${length} cartes collectionnées en plus de la/les vôtre(s)`,
                    files: [attachmentBasic],
                    ephemeral: true
                })
            } catch {
                mongoosepredi.connection.close();
            }
        });

    }
}