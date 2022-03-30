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

    execute(interaction) {
        const userId = interaction.user.id
        let nbFiles = 0;
        let attachmentBoost = ''

        const image = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}.png`))

        const attachment = new MessageAttachment(image)

        const length = fs.readdirSync(path.join(__dirname, `../../Assets/Cards`)).length

        interaction.reply({
            content: `1/${length} cartes collectionnées`,
            files: [attachment],
            ephemeral: true
        })

        try {
            const pathImg = `../../Assets/Cards/${userId}_boost.png`
            if (fs.existsSync(pathImg)) {
                const imageBoost = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}_boost.png`))
                attachmentBoost = new MessageAttachment(imageBoost)
            } else {
                attachmentBoost = ''
            }
            if (!attachmentBoost == '') {
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