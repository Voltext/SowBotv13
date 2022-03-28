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
  name: "loadmember",
  description: "Charger tous les utilisateurs",
  permission: "ADMINISTRATOR",

  async execute(interaction) {
    const {
      guild
    } = interaction

    const members = await guild.members.fetch();

    members.forEach(async element => {
      const path = `./Assets/Cards/${element.user.id}.png`
      try {
        if (!fs.existsSync(path)) {
          const user = element.user.username;
          const values = await Util.getMemberRole(element)
          const stats = [];
          for (let it = 0; it < 6; it++) {
            stats.push(Util.getRandomNumber(values[1], values[2]))
          }

          const canvas = createCanvas(350, 590)
          const ctx = canvas.getContext('2d')

          const background = await loadImage(
            path.join(__dirname, `../../Assets/Base/${values[0]}.png`)
          )
          let x = 0
          let y = 0
          ctx.drawImage(background, x, y)

          ctx.fillStyle = '#ffffff'
          ctx.textAlign = "center"
          ctx.font = '50px DINNextLTPro-Black'
          let scoreG = `${Math.round(Util.numAverage(stats))}`
          ctx.fillText(scoreG, 175, 210)

          ctx.fillStyle = '#ffffff'
          ctx.textAlign = "center"
          ctx.font = '30px DINNextLTPro-Black'
          let name = `${user.toUpperCase()}`
          ctx.fillText(name, 175, 245)

          ctx.fillStyle = '#ffffff'
          ctx.textAlign = "center"
          ctx.font = '12px DINNextLTPro-UltraLightIt'
          let poste = `Milieu`
          ctx.fillText(poste.toUpperCase().split('').join(' '), 175, 260)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat1 = `${stats[0]}`
          ctx.fillText(stat1, 120, 320)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat2 = `${stats[1]}`
          ctx.fillText(stat2, 225, 320)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat3 = `${stats[2]}`
          ctx.fillText(stat3, 120, 375)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat4 = `${stats[3]}`
          ctx.fillText(stat4, 225, 375)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat5 = `${stats[4]}`
          ctx.fillText(stat5, 120, 430)

          ctx.fillStyle = '#ffffff'
          ctx.font = '35px DINNextLTPro-Black'
          let stat6 = `${stats[5]}`
          ctx.fillText(stat6, 225, 430)

          ctx.beginPath();
          ctx.arc(175, 120, 40, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          const pfp = await loadImage(
            element.user.displayAvatarURL({
              format: 'png',
            })
          )

          ctx.drawImage(pfp, 130, 80, 90, 90)

          const attachment = new MessageAttachment(canvas.toBuffer())

          const buffer = canvas.toBuffer('image/png')
          fs.writeFileSync(`./Assets/Cards/${element.user.id}.png`, buffer)
        }
        else {
          console.log("Membe déjà existant");
        }
      } catch (err) {
        console.error(err)
      }

    });
  }
}