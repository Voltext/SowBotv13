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
  family: 'DINNextLTPro-BlackCondensed'
})

module.exports = {
  name: "presse",
  description: "Charger tous les utilisateurs",
  permission: "ADMINISTRATOR",

  async execute(interaction) {

    const titreMot = ["SURPRENANT", "COLOSSAL", "ETONNANT", "ATTENDU", "INCROYABLE"]
    const pseudo = interaction.user.username

    const canvas = createCanvas(793, 1020)
    const ctx = canvas.getContext('2d')

    const background = await loadImage(
      path.join(__dirname, `../../Assets/Base/ekipe.png`)
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    ctx.fillStyle = '#4d4d4d'
    ctx.textAlign = "center"
    ctx.font = '25px DIN Next LT Pro Black Condensed'
    let present = `${pseudo.toUpperCase()} VA DEVOIR FAIRE SES PREUVES`
    ctx.fillText(present, 275, 125)

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = "center"
    ctx.font = '140px DIN Next LT Pro Black Condensed'
    let scoreG = titreMot[Math.floor(Math.random() * titreMot.length)]
    ctx.fillText(scoreG, 380, 525)

    const pfp = await loadImage(
      interaction.user.displayAvatarURL({
        format: 'png',
      })
    )
    ctx.drawImage(pfp, 550, 31, 160, 160)

    const attachment = new MessageAttachment(canvas.toBuffer())
    interaction.reply({
      files: [attachment]
    })

  }
}