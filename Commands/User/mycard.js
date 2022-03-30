const {
    CommandInteraction,
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
const fs = require('fs')
const path = require('path');

module.exports = {
    name: "mycard",
    description: "Récupère ta carte",

    async execute(interaction) {


        const userId = interaction.user.id

        const imageBasic = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}.png`))

        const attachmentBasic = new MessageAttachment(imageBasic)

        const length = fs.readdirSync(path.join(__dirname, `../../Assets/Cards`)).length

        await interaction.reply({
            content: `1/${length} cartes collectionnées`,
            files: [attachmentBasic],
            ephemeral: true
        })
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