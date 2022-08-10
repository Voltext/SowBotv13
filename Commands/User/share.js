const mongo = require('../../mongo');
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')

module.exports = {
  name: "share",
  description: "Partager ce que vous voulez aux admin",
  options: [{
    name: 'lien',
    description: "Lien de votre fichier pdf",
    type: "STRING",
    required: true
  }, ],

  async execute(interaction) {
    const {guild} = interaction

    const lien = interaction.options.getString("lien")
    const userId = interaction.user.id

    guild.channels.cache.get(process.env.ADMIN_FEED).send({
			content: `<@${userId}> a partagé un fichier :` + lien,
		});
    

  interaction.reply({
      content: `Votre fichier a bien été partagé. Merci`,
      ephemeral: true
  })
    


  }
}