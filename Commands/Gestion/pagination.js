const {
    MessageEmbed,
    MessageAttachment,
    MessageButton
} = require("discord.js");
const pagination = require("../../Systems/ButtonPagination");
require('dotenv').config();
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const fs = require('fs')
const path = require('path');
const mongo = require('../../mongo');
const paginationEmbed = require('discordjs-button-pagination')

module.exports = {
    name: "pagination",
    description: "Affiche les nouvelles recuperations",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        const userId = interaction.user.id
        var ArrEmb = []
        var ArrImg = []
        await mongo().then(async (mongoosepredi) => {
            try {
                const results = await cardCollectionSchema.findOne({
                    userId,
                });
                if (results === null) {
                    interaction.reply({
                        content: "Vous n'avez aucune carte"
                    })
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
                    paginationEmbed(interaction, ArrEmb, ArrImg, buttonList, timeout);
                }
            } finally {
                mongoosepredi.connection.close();
            }
        })
    }
}