const { CommandInteraction, MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require('fs')
const path = require('path');

module.exports = {
    name: "loadimg",
    description: "Charge la carte d'un joueur",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'user',
            description: "L'utilisateur souhaité",
            type: "USER",
            required: true
        },
    ],

    execute(interaction) {
        const member = interaction.options.getMember('user');
        
        const image = fs.readFileSync(path.join(__dirname, `./Assets/Cards/${member.user.id}`))

        const attachment = new MessageAttachment(image)

        interaction.reply({
            files: [attachment]
        })
    }
}