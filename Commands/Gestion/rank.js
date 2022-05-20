const {
    MessageAttachment
} = require("discord.js");
require('dotenv').config();
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')
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
    name: "rank",
    description: "Reset le classement des prédicteurs",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
        let placement = 1;

        await mongo().then(async (mongooserank) => {
            try {
                const results = await rankPrediSchema.find({}, {
                    points: 1,
                    userName: 1,
                    _id: 0
                }, {
                    limit: 30
                }).sort({
                    "points": -1
                });

                if (results.length === 0) {
                    interaction.reply({
                        content: "Aucun utilisateur ne fait actuellement parti de ce classement"
                    })
                } else {
                    const canvas = createCanvas(1920, 1080)
                    const ctx = canvas.getContext('2d')

                    const background = await loadImage(
                        path.join(__dirname, `../../Assets/Base/Classement30.png`)
                    )
                    let x = 0
                    let y = 0

                    let xp = 350
                    let yp = 340

                    let x1 = 670
                    let y1 = 340

                    ctx.drawImage(background, x, y)
                    results.forEach(function (elem) {
                        ctx.fillStyle = '#ffffff'
                        ctx.font = '30px DINNextLTPro-Black'
                        let name1 = `${elem.userName.substr(0,18)}`
                        ctx.fillText(name1, xp, yp)

                        ctx.fillStyle = '#ffffff'
                        ctx.font = '30px DINNextLTPro-Black'
                        let points = `${elem.points}`
                        ctx.fillText(points, x1, y1)
                        
                        yp = yp + 65;
                        y1 = y1 + 65;

                        if (placement === 10) {
                            xp = 830
                            yp = 340

                            x1 = 1180
                            y1 = 340
                        }

                        if (placement === 20) {
                            xp = 1310
                            yp = 340

                            x1 = 1670
                            y1 = 340
                        }

                        placement = placement + 1;
                    })
                    const attachment = new MessageAttachment(canvas.toBuffer())
                    interaction.reply({
                        files: [attachment]
                    })
                }
                
            } catch {
                mongooserank.connection.close();
            }
        });
    }
}