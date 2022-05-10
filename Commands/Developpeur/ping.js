module.exports = {
    name: "ping",
    description: "Ping / Pong",
    permission: "ADMINISTRATOR",

    execute(interaction) {
        interaction.reply({ content: "PONG ! ", ephemeral: true });
    }
}