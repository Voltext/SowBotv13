const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {

        const count = 1950;
        const Original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
        const Edit = newMessage.content.slice(0, count) + (newMessage.content.length > count ? " ..." : "");

        const logEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setDescription(`Un [message](${newMessage.url}) a été modifié par ${newMessage.author} dans ${newMessage.channel}.
        **Original**: \`\`\`${Original}\`\`\`
        **Edité**: \`\`\`${Edit}\`\`\`
        \n`)

        if(newMessage.attachments.size > 0) {
            logEmbed.addField(`Attachments:`, `${newMessage.attachments.map((a) => a.url)}`, true)
        }

        newMessage.guild.channels.cache.get(process.env.LOG_MESSAGE).send({embeds: [logEmbed]})
    }
}