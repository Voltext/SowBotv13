const { Modal } = require('discord-modals')

module.exports = {
  name: "modalSubmit",

  /** 
  * @param { Modal } modal 
  */

  async execute(modal) {
    if(modal.customId !== 'teamModal') return

    const value = modal.getTextInputValue('raisonRemove')
    console.log(modal)

    guild.channels.cache.get(process.env.ADMIN_FEED).send({
      content: `vient de supprimer son équipe pour la raison : ${value}`
    })
  }
};