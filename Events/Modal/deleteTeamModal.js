const { Modal } = require('discord-modals')
const { Formatters, MessageEmbed } = require('discord.js');

module.exports = {
  name: "modalSubmit",

  /** 
  * @param { Modal } modal 
  */

  async execute(modal) {
    console.log(modal)
    if(modal.customId === 'modal-customid') {
      const firstResponse = modal.getTextInputValue('textinput-customid');
      modal.member.guild.channels.cache.get(process.env.ADMIN_FEED).send({
        embeds: [new MessageEmbed().setTitle("Suppression d'équipe").setDescription(`${modal.user.username} vient de supprimer son équipe pour la raison suivante : ${Formatters.codeBlock('markdown', firstResponse)}`).setColor('RED')]
      })

      modal.reply({ 
        embeds: [new MessageEmbed().setTitle("Suppression d'équipe").setDescription(`La suppression de votre équipe a bien été prise en compte pour la raison suivante : ${Formatters.codeBlock('markdown', firstResponse)}`).setColor('GREEN')],
        ephemeral: true
      });
    } 

    
  }
};