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
      modal.reply('Congrats! Powered by discord-modals.' + Formatters.codeBlock('markdown', firstResponse));
    } 

    guild.channels.cache.get(process.env.ADMIN_FEED).send({
      content: `vient de supprimer son équipe pour la raison : ${value}`
    })
  }
};