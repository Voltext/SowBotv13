const {
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "say",
    description: "Permet de faire dire ce qu'on veut au bot",
    permission: "KICK_MEMBERS",
    options: [{
            name: 'phrase',
            description: "La phrase a faire dire",
            type: "STRING",
            required: true
        },
        {
            name: 'salon',
            description: "Salon où envoye le message",
            type: "CHANNEL",
            required: true
        },
    ],

    execute(interaction) {
        const {
            guild
        } = interaction;
        const phrase = interaction.options.getString('phrase');
        const loggingChannel = interaction.options.getChannel("salon").id;
        guild.channels.cache.get(loggingChannel).send({
            content: `${phrase}`
        })
        interaction.reply({
            content: `Message envoyé dans <#${loggingChannel}>`,
            ephemeral: true
        })

    }
}