const {
    CommandInteraction,
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema');
const prediSchema = require('../../Schemas/prediSchema');
const Util = require('../../Utils/function')
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

    async execute(interaction, client) {
        const {
            guild
        } = interaction

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
                    userId: 1,
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
                        battle.push([elem.userName, elem.points, elem.userId])
                        placement = placement + 1;
                        const member = await guild.members.fetch(elem.userId);
                        member.roles.add(battleRole)

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

                ctx.fillStyle = '#e5b040'
                ctx.font = '30px DINNextRoundedLTPro-Bold'
                let name1 = `${battle[0][0]}`
                ctx.fillText(name1, 280, 150)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name2 = `${battle[1][0]}`
                ctx.fillText(name2, 280, 250)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name3 = `${battle[2][0]}`
                ctx.fillText(name3, 280, 380)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name4 = `${battle[3][0]}`
                ctx.fillText(name4, 280, 490)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name5 = `${battle[4][0]}`
                ctx.fillText(name5, 280, 610)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name6 = `${battle[5][0]}`
                ctx.fillText(name6, 280, 720)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name7 = `${battle[6][0]}`
                ctx.fillText(name7, 280, 850)

                ctx.fillStyle = '#ffffff'
                ctx.font = '30px DINNextLTPro-Black'
                let name8 = `${battle[7][0]}`
                ctx.fillText(name8, 280, 950)

                ctx.fillStyle = '#e5b040'
                ctx.font = '80px DINNextLTPro-Black'
                let month = `${name}`
                ctx.fillText(month.toUpperCase(), 1250, 120)

                for (let i in battle) {
                    const member = await guild.members.fetch(battle[i][2])

                    const pdp = await loadImage(member.user.displayAvatarURL({
                        format: 'png',
                    }))

                    let size = 50
                    if(i == 1) {
                        valueI = 0.9
                    }
                    else if(i == 2) {
                        valueI = 2.02
                    }
                    else if(i == 3) {
                        valueI = 2.93
                    }
                    else if(i == 4) {
                        valueI = 4.03
                    }
                    else if(i == 5) {
                        valueI = 4.947
                    }
                    else if(i == 6) {
                        valueI = 6.05
                    }
                    else if(i == 7) {
                        valueI = 6.95
                    }
                    else {
                        valueI = i
                    } 
                    ctx.drawImage(pdp, 170, 95 + valueI * (size + 65), size * 1.75, size * 1.75)
                }


                const attachment = new MessageAttachment(canvas.toBuffer(), 'battle.png')

                rankEmbed.setImage('attachment://battle.png')

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