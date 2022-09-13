const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      interaction.update({ content: 'Entrainement en cours...', components: [] })
      .then(()=> {
        setTimeout(function(){
          interaction.update({ content: 'Entrainement terminé !', components: [] });
        }, 5000)
      }); ;
    }
  }
}