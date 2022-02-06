const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    description: "Permet de faire dire ce qu'on veut au bot",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'phrase',
            description: "La phrase a faire dire",
            type: "STRING",
            required: true
        },
    ],

    execute(interaction) {
        const { guild } = interaction;
        const phrase = interaction.options.getString('phrase');
        guild.channels.cache.get(process.env.GENERAL).send({
            content: `${phrase}`
        });
        interaction.reply({content: "Message envoyé", ephemeral: true})
        
    }
}