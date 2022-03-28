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

        const image = fs.readFileSync(path.join(__dirname, `../../Assets/Cards/${userId}.png`))

        const attachment = new MessageAttachment(image)

        const dir = './Assets/Cards';

        fs.readdir(dir, (err, files) => {
            nbFiles = files.length
        });

        interaction.reply({
            content: `1/${nbFiles} cartes collectionnées`,
            files: [attachment],
            ephemeral: true
        })
    }
}