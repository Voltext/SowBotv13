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
        const userName = interaction.user.username
        var ArrEmb = []
        var ArrImg = []

        const imageBasic = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}.png`))

        const attachmentBasic = new MessageAttachment(imageBasic)
        const embed = new MessageEmbed().setImage(`attachment://${userId}`)

        const length = fs.readdirSync(path.join(__dirname, `../../Assets/Cards`)).length

        let nbCards = 0

        ArrImg.push(attachmentBasic)
        ArrEmb.push(embed)

        try {
            const pathImg = path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`)
            if (fs.existsSync(pathImg)) {
                const imageBoost = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`))
                const attachmentBoost = new MessageAttachment(imageBoost)
                const embeds = new MessageEmbed().setImage(`attachment://${userId}`)

                ArrImg.push(attachmentBoost)
                ArrEmb.push(embeds)
            }
        } catch (err) {
            console.error(err)
        }

        await mongo().then(async (mongoosepredi) => {
            try {
                const results = await cardCollectionSchema.findOne({
                    userId,
                });
                if (results === null) {

                } else {
                    const ArrCards = results.cards

                    ArrCards.forEach(function (elem) {
                        const image = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${elem}`))
                        const embed = new MessageEmbed().setImage(`attachment://${elem}`)
                        const img = new MessageAttachment(image);

                        ArrEmb.push(embed)
                        ArrImg.push(img)
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