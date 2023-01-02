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
    name: "mycollection",
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
                    const embed = new MessageEmbed().setImage(`http://clubhousemanager.fr/Cards/${userId}.png`)
                        
                    ArrEmb.push(embed)
                    pagination.setEmbeds(ArrEmb);
                    pagination.render();
                } else {
                    const ArrCards = results.cards

                    const embed = new MessageEmbed().setImage(`http://clubhousemanager.fr/Cards/${userId}.png`)
                        
                    ArrEmb.push(embed)

                    try {
                        const pathImg = path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`)
                        if(fs.existsSync(pathImg)) {
                            const embed = new MessageEmbed().setImage(`http://clubhousemanager.fr/Cards/${userId}_boost.png`)
                        
                            ArrEmb.push(embed)
                        }
                    }
                    catch (e) {
                        console.error(e)
                    }

                    ArrCards.forEach(function (elem) {
                        const embed = new MessageEmbed().setImage(`http://clubhousemanager.fr/Cards/${elem}`)

                        ArrEmb.push(embed)
                    })

                    pagination.setEmbeds(ArrEmb);
                    pagination.render();
                }
            } catch {
                console.log("Erreur commande collection carte: mycollection(65)")
                mongoosepredi.connection.close();
            }
        })

    }
}