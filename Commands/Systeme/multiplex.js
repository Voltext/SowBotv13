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
    ],

    execute(interaction) {
        const but = interaction.options.getString("but");
        const match = interaction.options.getString("match");
        const score = interaction.options.getString("score");

        const equipe = match.split('-')

        const embed = new MessageEmbed()
        .setTitle(`BUUUUUUUUUT : ${but}`)
        .setColor('BLUE')
        .setAuthor({ name: match})
        .setDescription(`${equipe[0]} ${score} ${equipe[1]}}`)

        interaction.reply({
            embeds: [embed]
        })
    }
}