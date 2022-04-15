const {
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
    Client
} = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        if (message.author.bot) return
        if (message.channel.type === 'dm') return

        const {
            content,
            guild,
            author,
            channel
        } = message
        const messageContent = content.toLowerCase().split(" ");

        // if (messageContent[messageContent.length - 1] === "quoi" || messageContent[messageContent.length - 1] === "quoi?" || messageContent[messageContent.length - 1] === "Quoi?" || messageContent[messageContent.length - 1] === "Quoi") {
        //     message.channel.send("Feur...");
        // }
        // else if (messageContent[messageContent.length - 1] === "hein?" || messageContent[messageContent.length - 1] === "hein" || messageContent[messageContent.length - 1] === "Hein" || messageContent[messageContent.length - 1] === "Hein?") {
        //         message.channel.send("2.");
        // }
        // else if (messageContent[messageContent.length - 1] === "Non" || messageContent[messageContent.length - 1] === "non") {
        //     message.channel.send("Bril...");
        // }
        // else if (messageContent[messageContent.length - 1] === "Si" || messageContent[messageContent.length - 1] === "si") {
        //     message.channel.send("Tron 🍋");
        // }
        // else if (messageContent[messageContent.length - 1] === "Oui" || messageContent[messageContent.length - 1] === "oui") {
        //     message.channel.send("Stiti 🐒");
        // }
        /* if (messageContent[messageContent.length - 1] == "Trigger" || messageContent[messageContent.length - 1] == "trigger") {
            let avatar = message.author.displayAvatarURL({
                dynamic: true,
                format: 'png'
            });
            // Make the image
            let img = await new DIG.Triggered().getImage(avatar)
            // Add the image as an attachement
            let attach = new .MessageAttachment(img, "delete.png");;
            message.channel.send({
                files: [attach]
            })
        } */
    }
}