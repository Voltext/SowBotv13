const { ContextMenuInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userinfo",
    type: "USER",
    permission: "KICK_MEMBERS",

    /**
     * 
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor({ name: target.user.tag, iconURL: target.user.avatarURL({dynamic: true, size: 512})})
        .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
        .addField("ID", `${target.user.id}`)
        .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`)
        .addField("Membre depuis:", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
        .addField("Compte crée le:", `\`${moment(new Date(target.user.createdTimestamp)).format("DD/MM/YYYY @ hh:mm:ss a")}\``)

        interaction.reply({embeds: [Response], ephemeral: true})
    }
}
