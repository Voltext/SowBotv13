const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "multiplex",
    description: "Gestion du multiplex",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'type',
            description: "Equipe qui marque",
            type: "STRING",
            required: true,
            choices: [{
                name: "But",
                value: "but"
              },
              {
                name: "Carton Jaune",
                value: "jaune"
              },
              {
                name: "Carton Rouge",
                value: "rouge"
              },
            ]
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
            name: 'minute',
            description: "minute du but",
            type: "STRING",
            required: true
        },
        {
            name: 'channel',
            description: "recupere le channel sur lequel envoyer le message",
            type: "CHANNEL",
            required: true
        },
        {
            name: 'but',
            description: "minute du but",
            type: "STRING",
            required: false
        },
    ],

    execute(interaction) {
        const { guild } = interaction

        const loggingChannel = interaction.options.getChannel("channel").id;

        const type = interaction.options.getString("type");
        const but = interaction.options.getString("but");
        const minute = interaction.options.getString("minute");
        const buteur = interaction.options.getString("buteur");
        const match = interaction.options.getString("match");
        const score = interaction.options.getString("score");

        const equipe = match.split('-')

        let infos = ''
        let stats = ''
        let color = ''

        if(type == 'but') {
            infos = `${minute}' : ⚽ ${buteur}`
            stats = `BUUUUUUUUUT : ${but}`
            color= 'BLUE'
        }
        if(type == 'jaune') {
            infos = `${minute}' : 🟨 ${buteur}`
            stats = `Carton Jaune : ${but}`
            color = 'GOLD'
        }
        if(type == 'rouge') {
            infos = `${minute}' : 🟥 ${buteur}`
            stats = `Carton Rouge : ${but}`
            color = 'RED'
        }

        const embed = new MessageEmbed()
        .setTitle(`${stats}`)
        .setColor(`${color}`)
        .setDescription(`**${equipe[0]} ${score} ${equipe[1]}** \n \n ${infos}`)

        guild.channels.cache.get(loggingChannel).send({
            embeds: [embed]
          })
    }
}