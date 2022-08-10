const isImage = require('is-image');

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

    console.log(interaction)
   
    if(isImage(lien)) {
      guild.channels.cache.get(process.env.ADMIN_FEED).send({
        content: `<@${userId}> a partagé un fichier :` + lien,
      });
      
  
    interaction.reply({
        content: `Votre fichier a bien été partagé. Merci`,
        ephemeral: true
    })
    }
    else {
      interaction.reply({
        content: `Le fichier envoyé n'est pas une image, Attention, toute tentative d'envoyer des virus sera sévéremet puni. Les administrateurs ont été prévenu.`,
        ephemeral: true
    })
    }
    
    


  }
}