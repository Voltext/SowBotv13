const {
    CommandInteraction,
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema');
const prediSchema = require('../../Schemas/prediSchema');
const {
    registerFont,
    createCanvas,
    loadImage
} = require("canvas")
const path = require('path');
registerFont('./Assets/Fonts/DINNextLTPro-Black.ttf', {
    family: 'DINNextLTPro-Black'
})
registerFont('./Assets/Fonts/DINNextLTPro-UltraLightIt.ttf', {
    family: 'DINNextLTPro-UltraLightIt'
})
registerFont('./Assets/Fonts/DINNextRoundedLTPro-Bold.ttf', {
    family: 'DINNextRoundedLTPro-Bold'
})

module.exports = {
    name: "reset",
    description: "Reset le classement des prédicteurs",
    permission: "BAN_MEMBERS",

    async execute(interaction) {

        const { guild } = interaction
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
                    results.forEach(async function (elem) {
                        pseudos = pseudos + elem.userName + '\n';
                        pointsPlayer = pointsPlayer + elem.points + '\n';
                        battle.push([elem.userName, elem.points])
                        placement = placement + 1;
                        const members = await guild.members.fetch();
                        members.forEach(async element => {
                            if(element.user.id == elem.userId) {
                                console.log(element)
                                await element.roles.add(process.env.BATTLE)
                            }
                        })
                    })
                    rankEmbed.addFields({
                        name: '#',
                        value: "#",
                        inline: true
                    }, {
                        name: '❯ Pseudo',
                        value: battle[0][0],
                        inline: true
                    }, {
                        name: '❯ Points',
                        value: battle[0][1].toString(),
                        inline: true
                    }, );

                    rankEmbed.setFooter("Félicitation !")
                }

                const canvas = createCanvas(1920, 1080)
                const ctx = canvas.getContext('2d')

                const background = await loadImage(
                    path.join(__dirname, `../../Assets/Base/Battle.png`)
                )
                let x = 0
                let y = 0
                ctx.drawImage(background, x, y)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name1 = `${battle[0][0]}`
                ctx.fillText(name1, 420, 280)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name2 = `${battle[7][0]}`
                ctx.fillText(name2, 420, 415)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name3 = `${battle[1][0]}`
                ctx.fillText(name3, 420, 660)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name4 = `${battle[6][0]}`
                ctx.fillText(name4, 420, 810)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name5 = `${battle[2][0]}`
                ctx.fillText(name5, 1280, 280)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name6 = `${battle[5][0]}`
                ctx.fillText(name6, 1280, 415)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name7 = `${battle[3][0]}`
                ctx.fillText(name7, 1280, 660)

                ctx.fillStyle = '#000000'
                ctx.font = '30px DINNextLTPro-Black'
                let name8 = `${battle[4][0]}`
                ctx.fillText(name8, 1280, 810)

                ctx.fillStyle = '#a69b94'
                ctx.font = '43px DINNextLTPro-Black'
                let month = `${name}`
                ctx.fillText(month.toUpperCase(), 1000, 250)

                const attachment = new MessageAttachment(canvas.toBuffer())

                interaction.reply({
                    embeds: [rankEmbed],
                    files: [attachment]
                })
                // await mongo().then(async (mongoosereset2) => {
                //     try {
                //         await rankPrediSchema.deleteMany({
                //         })
                //     } finally {
                //         mongoosereset2.connection.close()
                //     }
                // })
            } finally {
                mongoosereset1.connection.close();
            }
        });
    }
}