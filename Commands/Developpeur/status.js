const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
require("../../Events/Client/ready");

module.exports = {
    name: "status",
    description: "Affiche les statistiques et l'état du bot",
    permission: "ADMINISTRATOR",
    /**
     * 
     * @param { CommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {

        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setDescription(`**Statut** : \`🟢 En ligne\` - \`${client.ws.ping}ms\`\n **Depuis**: <t:${parseInt(client.readyTimestamp / 1000)}:R>)\n
        **Base de donnée**: \`${switchTo(connection.readyState)}\``)

        interaction.reply({embeds: [Response], ephemeral: true})
    }
}

function switchTo(val) {
    var status = " ";
    switch(val) {
        case 0 : status = `🔴 DECONNECTEE`
        break;
        case 1 : status = `🟢 CONNECTEE`
        break;
        case 2 : status = `🔵 CONNEXION...`
        break;
        case 3 : status = `🟠 DECONNEXION...`
        break;
    }
    return status;
}