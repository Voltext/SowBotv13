const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: "ticket",
    description: "Envoie un ticket au support",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        const { guild } = interaction;

        const Embed = new MessageEmbed()
        .setAuthor({
            name: guild.name + " | Système de ticket",
            iconURL: guild.iconURL({ dynamic: true })
        })
        .setDescription(
            "Ouvrir un ticket pour demander de l'aide"
        )
        .setColor("#36393f");

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
            .setCustomId('player')
            .setLabel("Report un Membre")
            .setStyle("PRIMARY")
            .setEmoji("👤"),
            new MessageButton()
            .setCustomId("suggestion")
            .setLabel("Suggestion")
            .setStyle("SUCCESS")
            .setEmoji("💡"),
            new MessageButton()
            .setCustomId("bug")
            .setLabel("Bug")
            .setStyle("SECONDARY")
            .setEmoji("🟥")
        );

        await guild.channels.cache.get(process.env.TICKET).send({
            embeds: [Embed],
            components: [Buttons]
        })
        interaction.reply({
            content: "Ok!",
            ephemeral: true
        })

    }
}