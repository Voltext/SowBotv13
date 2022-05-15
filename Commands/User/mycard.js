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