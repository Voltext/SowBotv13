const { Modal } = require('discord-modals')
const { Formatters } = require('discord.js');

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
        content: `${modal.user.username} vient de supprimer son équipe pour la raison suivante : ${Formatters.codeBlock('markdown', firstResponse)}`
      })
    } 

    
  }
};