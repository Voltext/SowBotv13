const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require('fs')
const path = require('path');

module.exports = {
    name: "mycard",
    description: "Récupère ta carte",
    options: [
        {
            name: 'user',
            description: "L'utilisateur souhaité",
            type: "USER",
            required: true
        },
    ],

    execute(interaction) {
        const userId = interaction.user.id
        
        const image = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}.png`))

        const attachment = new MessageAttachment(image)

        interaction.reply({
            files: [attachment],
            ephemeral: true
        })
    }
}