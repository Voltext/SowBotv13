const {
    MessageEmbed
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema');
const prediSchema = require('../../Schemas/prediSchema');

module.exports = {
    name: "reset",
    description: "Reset le classement des prédicteurs",
    permission: "BAN_MEMBERS",

    async execute(interaction) {
        let battle = [];
        let pseudos = '';
        let pointsPlayer = '';
        let placement = 1;

        const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

        const d = new Date();
        let name = month[d.getMonth()];

        await mongo().then(async (mongoosereset1) => {
            try {
                const results = await rankPrediSchema.find({}, {
                    points: 1,
                    userName: 1,
                    _id: 0
                }, {
                    limit: 8
                }).sort({
                    "points": -1
                });

                const rankEmbed = new MessageEmbed()
                    .setTitle(`Gagnant du mois de ${name}`)
                    .setDescription(`Voici le gagnant du classement des prédicteurs du mois de ${name} (Avant play-off)`);

                if (results.length === 0) {
                    rankEmbed.addField("Classement", "Aucun gagnant ce mois-ci")
                } else {
                    results.forEach(function (elem) {
                        pseudos = pseudos + elem.userName + '\n';
                        pointsPlayer = pointsPlayer + elem.points + '\n';
                        battle.push([elem.userName, elem.points])
                        placement = placement + 1;
                    })
                    rankEmbed.addFields({
                        name: '#',
                        value: "#",
                        inline: true
                    },{
                        name: '❯ Pseudo',
                        value: battle[0][0],
                        inline: true
                    }, {
                        name: '❯ Points',
                        value: battle[0][1].toString(),
                        inline: true
                    }, );
                    rankEmbed.addField("BATTLE", "Voici les battle en fonction du classement", false)
                    rankEmbed.addFields({
                        name: '❯ Joueur 1',
                        value: `${battle[0][0]} \n ${battle[1][0]} \n ${battle[2][0]} \n ${battle[3][0]}`,
                        inline: true
                    },{
                        name: 'VS',
                        value: "vs \n vs \n vs \n vs",
                        inline: true
                    }, {
                        name: '❯ Joueur 2',
                        value: `${battle[7][0]} \n ${battle[6][0]} \n ${battle[5][0]} \n ${battle[4][0]}`,
                        inline: true
                    }, );

                    rankEmbed.setFooter("Félicitation !")
                }
                interaction.reply({
                    embeds: [rankEmbed]
                })
                await mongo().then(async (mongoosereset2) => {
                    try {
                        await rankPrediSchema.deleteMany({
                        })
                    } finally {
                        mongoosereset2.connection.close()
                    }
                })
            } finally {
                mongoosereset1.connection.close();
            }
        });
    }
}