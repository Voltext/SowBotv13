const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      console.log(interaction.member.user.id)
      interaction.update({ content: 'Entrainement en cours...', components: [] })
      .then(()=> {
        setTimeout(function(){
          interaction.followUp({ content: 'Entrainement terminé !', components: [], ephemeral: true });
        }, 5000)
      }); ;
    }
  }
}