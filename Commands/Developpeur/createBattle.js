const {
    CommandInteraction,
    MessageEmbed,
    MessageAttachment
  } = require("discord.js");
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
    name: "createbattle",
    description: "Charger tous les utilisateurs",
    permission: "ADMINISTRATOR",
  
    async execute(interaction) {
      const {
        guild
      } = interaction
  
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
      let name1 = `Voltext`
      ctx.fillText(name1, 420, 280)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name2 = `Voltext`
      ctx.fillText(name2, 420, 415)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name3 = `Voltext`
      ctx.fillText(name3, 420, 660)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name4 = `Voltext`
      ctx.fillText(name4, 420, 810)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name5 = `Voltext`
      ctx.fillText(name5, 1280, 280)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name6 = `Voltext`
      ctx.fillText(name6, 1280, 415)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name7 = `Voltext`
      ctx.fillText(name7, 1280, 660)
  
      ctx.fillStyle = '#000000'
      ctx.font = '30px DINNextLTPro-Black'
      let name8 = `Voltext`
      ctx.fillText(name8, 1280, 810)

      ctx.fillStyle = '#a69b94'
      ctx.font = '43px DINNextLTPro-Black'
      let month = `Mars`
      ctx.fillText(month.toUpperCase(), 1000, 250)

      const attachment = new MessageAttachment(canvas.toBuffer())
      interaction.reply({
          files: [attachment]
      })
    }
  }