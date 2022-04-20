const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "multiplex",
    description: "Gestion du multiplex",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'but',
            description: "Equipe qui marque",
            type: "STRING",
            required: true
        },
        {
            name: 'buteur',
            description: "buteur",
            type: "STRING",
            required: true
        },
        {
            name: 'match',
            description: "match du multiplex",
            type: "STRING",
            required: true
        },
        {
            name: 'score',
            description: "score du multiplex",
            type: "STRING",
            required: true
        },
        {
            name: 'channel',
            description: "recupere le channel sur lequel envoyer le message",
            type: "CHANNEL",
            required: true
        },
    ],

    execute(interaction) {
        const { guild } = interaction

        const loggingChannel = interaction.options.getChannel("channel").id;

        const but = interaction.options.getString("but");
        const buteur = interaction.options.getString("buteur");
        const match = interaction.options.getString("match");
        const score = interaction.options.getString("score");

        const equipe = match.split('-')

        const embed = new MessageEmbed()
        .setTitle(`BUUUUUUUUUT : ${but}`)
        .setColor('BLUE')
        .setDescription(`**${equipe[0]} ${score} ${equipe[1]}** \n \n ⚽ ${buteur}`)

        guild.channels.cache.get(loggingChannel).send({
            embeds: [embed]
          })
    }
}