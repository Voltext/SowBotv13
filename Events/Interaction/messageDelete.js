const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "messageDelete",
    async execute(message) {

        const logDelete = new MessageEmbed()
        .setColor("RED")
        .setDescription(`Un [message](${message.url}) a été supprimé par ${message.author} dans ${message.channel}.
        **Message supprimé**: \`\`\`${message}\`\`\`
        \n`)

        if(message.attachments.size > 0) {
            logDelete.addField(`Attachments:`, `${message.attachments.map((a) => a.url)}`, true)
        }

        message.guild.channels.cache.get(process.env.LOG_MESSAGE).send({embeds: [logDelete]})
    }
}