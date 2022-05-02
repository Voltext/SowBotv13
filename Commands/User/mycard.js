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
                    const button1 = new MessageButton()
                        .setCustomId("previousbtn")
                        .setLabel("Previous")
                        .setStyle("DANGER");

                    const button2 = new MessageButton()
                        .setCustomId("nextbtn")
                        .setLabel("Next")
                        .setStyle("SUCCESS");

                    const buttonList = [button1, button2];
                    const timeout = 10000;
                    paginationEmbed(interaction, ArrEmb, ArrImg, userName, buttonList, timeout);
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
        try {
            const pathImg = path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`)
            if (fs.existsSync(pathImg)) {
                const imageBoost = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`))
                const attachmentBoost = new MessageAttachment(imageBoost)
                interaction.followUp({
                    content: `Vous possedez une carte Boost !`,
                    files: [attachmentBoost],
                    ephemeral: true
                })
            }
        } catch (err) {
            console.error(err)
        }

    }
}