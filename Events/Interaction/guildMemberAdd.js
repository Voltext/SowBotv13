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
  name: "guildMemberAdd",
  async execute(interaction, member) {
    const {
      options,
      guild,
      channel
    } = interaction;

    console.log(interaction);

    let memberCount = interaction.guild.memberCount

    const memberChannel = guild.channels.cache.get(process.env.MEMBER_COUNT);
    memberChannel.send({
      content: "Un membre vient de rejoindre le serveur. Nous sommes " + memberCount + " membres sur le serveur."
    });
    memberChannel.edit({
      name: `${memberCount} Membres`,
    });
    const posteCard = ["Attaquant", "Milieu", "Défenseur"]
    const stats = [];
    for (let it = 0; it < 6; it++) {
      stats.push(Util.getRandomNumbers(70, 82))
    }

    const canvas = createCanvas(350, 590)
    const ctx = canvas.getContext('2d')

    const background = await loadImage(
      path.join(__dirname, `../../Assets/Base/Commune.png`)
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
    let name = `${interaction.user.username.toUpperCase()}`
    ctx.fillText(name, 175, 245)

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = "center"
    ctx.font = '12px DINNextLTPro-UltraLightIt'
    let poste = `${posteCard[Util.getRandomNumbers(0,2)]}`
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
      interaction.user.displayAvatarURL({
        format: 'png',
      })
    )

    ctx.drawImage(pfp, 130, 80, 90, 90)

    const attachment = new MessageAttachment(canvas.toBuffer())

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`./Assets/Cards/${interaction.user.id}.png`, buffer)
  }
}