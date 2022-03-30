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

    async execute(interaction) {
        const member = interaction.options.getMember('user');
        
        const image = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${member.user.id}.png`))

        const attachment = new MessageAttachment(image)

        await interaction.reply({
            files: [attachment]
        })

        try {
            const pathImg = path.join(__dirname, `../../Assets/Cards/${member.user.id}_boost.png`)
            if (fs.existsSync(pathImg)) {
                const imageBoost = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${member.user.id}_boost.png`))
                const attachmentBoost = new MessageAttachment(imageBoost)
                interaction.followUp({
                    files: [attachmentBoost]
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
    
}