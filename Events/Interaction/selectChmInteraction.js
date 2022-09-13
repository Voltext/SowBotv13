const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      interaction.update({ content: 'Entrainement en cours...', components: [] })
      .then((msg)=> {
        setTimeout(function(){
          msg.edit('Entrainement terminé !');
        }, 5000)
      }); ;
    }
  }
}