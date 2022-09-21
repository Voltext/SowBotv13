const {
  registerFont,
  createCanvas,
  loadImage
} = require("canvas")
const path = require('path');
const Util = require('../../Utils/function')
const fs = require('fs')
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
  name: "presse",
  description: "Charger tous les utilisateurs",
  permission: "ADMINISTRATOR",

  async execute(interaction) {

    const titreMot = ["Surprenant", "Colossal", "Etonnant", "Attendu", "Incroyable"]

    const canvas = createCanvas(793, 1020)
    const ctx = canvas.getContext('2d')

    const background = await loadImage(
      path.join(__dirname, `../../Assets/Base/ekipe.png`)
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = "center"
    ctx.font = '50px DINNextLTPro-Black'
    let scoreG = titreMot[Math.floor(Math.random() * titreMot.length)]
    ctx.fillText(scoreG, 175, 210)

    const attachment = new MessageAttachment(canvas.toBuffer())
    interaction.reply({
      files: [attachment]
    })

  }
}