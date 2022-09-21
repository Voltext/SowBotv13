const {
  MessageAttachment
} = require("discord.js");
const {
  registerFont,
  createCanvas,
  loadImage
} = require("canvas")
const path = require('path');
const Util = require('../../Utils/function')
const fs = require('fs')
registerFont('./Assets/Fonts/DINNextLTPro-HeavyItalic.ttf', {
  family: 'DINNextLTPro-HeavyItalic'
})
registerFont('./Assets/Fonts/DINNextLTPro-BlackItalic.ttf', {
  family: 'DINNextLTPro-BlackItalic'
})
registerFont('./Assets/Fonts/DINNextLTPro-BoldCondensed.ttf', {
  family: 'DINNextLTPro-BoldCondensed',
})
registerFont('./Assets/Fonts/DINNextLTPro-BlackCondensed.ttf', {
  family: 'DIN Next LT Pro Black Condensed'
})

module.exports = {
  name: "presse",
  description: "Charger tous les utilisateurs",
  permission: "ADMINISTRATOR",

  async execute(interaction) {

    const titreMot = ["SURPRENANT", "COLOSSAL", "ETONNANT", "ATTENDU", "INCROYABLE"]

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
    ctx.font = '110px DIN Next LT Pro Black Condensed'
    let scoreG = titreMot[Math.floor(Math.random() * titreMot.length)]
    ctx.fillText(scoreG, 370, 530)

    const attachment = new MessageAttachment(canvas.toBuffer())
    interaction.reply({
      files: [attachment]
    })

  }
}