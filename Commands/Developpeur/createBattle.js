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
      ctx.fillText(name1, 175, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name2 = `Voltext`
      ctx.fillText(name2, 300, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name3 = `Voltext`
      ctx.fillText(name3, 450, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name4 = `Voltext`
      ctx.fillText(name4, 600, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name5 = `Voltext`
      ctx.fillText(name5, 750, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name6 = `Voltext`
      ctx.fillText(name6, 900, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name7 = `Voltext`
      ctx.fillText(name7, 1050, 210)
  
      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let name8 = `Voltext`
      ctx.fillText(name8, 1200, 210)

      ctx.fillStyle = '#ffffff'
      ctx.font = '30px DINNextLTPro-Black'
      let month = `Voltext`
      ctx.fillText(month, 175, 400)

      const attachment = new MessageAttachment(canvas.toBuffer())
      interaction.reply({
          files: [attachment]
      })
    }
  }