const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor("RED")
                    .setDescription("⛔ Une erreur est survenue pendant l'utilisation de la commande")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client)
        }
    }
}