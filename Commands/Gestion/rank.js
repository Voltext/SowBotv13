const {
    MessageEmbed
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')

module.exports = {
    name: "rank",
    description: "Reset le classement des prédicteurs",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        let placement = 1;

        let rank = '';
        let pseudos = '';
        let pointsPlayer = '';

        await mongo().then(async (mongoose) => {
            try {
                const results = await rankPrediSchema.find({}, {
                    points: 1,
                    userName: 1,
                    _id: 0
                }, {
                    limit: 20
                }).sort({
                    "points": -1
                });


                const rankEmbed = new MessageEmbed()
                    .setTitle("Classement des prédicteurs")
                    .setDescription("Voici le TOP 20 des meilleurs prédicteurs du serveur");

                if (results.length === 0) {
                    rankEmbed.addField("Classement", "Aucun utilisateur ne fait actuellement parti de ce classement")
                } else {
                    results.forEach(function (elem) {
                        rank = rank + placement + '\n';
                        pseudos = pseudos + elem.userName + '\n';
                        pointsPlayer = pointsPlayer + elem.points + '\n';
                        placement = placement + 1;
                        if(placement === 9) {
                            rank = rank + "--\n";
                            pseudos = pseudos + '**------- PLAY - OFF -------**\n';
                            pointsPlayer = pointsPlayer + "--\n";
                        }
                    })
                    rankEmbed.addFields({
                        name: '❯ Placement',
                        value: rank,
                        inline: true
                    }, {
                        name: '❯ Pseudo',
                        value: pseudos,
                        inline: true
                    }, {
                        name: '❯ Points',
                        value: pointsPlayer,
                        inline: true
                    }, );
                }
                interaction.reply({embeds: [rankEmbed]})
            } finally {
                mongoose.connection.close();
            }
        });
    }
}