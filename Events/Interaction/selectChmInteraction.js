const {
  MessageEmbed
} = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const Util = require('../../Utils/function')
const mongo = require('../../mongo');
const PlayerMysql = require('../../Schemas/mysql/PlayerMysql')

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      const userId = interaction.member.user.id;
      const stat = interaction.values[0].split("_")[0]
      const idStat = interaction.values[0].split("_")[1]
      let blessure = "Non"
      const playerData = await PlayerMysql.getPlayer(userId)
      if (playerData[0] !== "") {
            if(playerData[0].stamina < 20) {
              blessure = "Oui"
            }
            else {
              blessure = "Non"
            }
            const embedTrainingProgress = new MessageEmbed()
              .setTitle("Entrainement en cours...")
              .setDescription("Vous venez de lancer un entrainement pour votre joueur dans la catégorie : `" + stat + "`")
              .addFields({
                name: "Stats après entrainement",
                value: "+1 (" + stat + ")",
                inline: true
              }, {
                name: "Stamina après entrainement",
                value: "-20",
                inline: true
              })
              .setColor("GOLD")
              .setThumbnail(playerData[0].profil);
            interaction.update({
                embeds: [embedTrainingProgress],
                components: []
              })
              .then(() => {
                setTimeout(function () {
                  const embedTrainingEnd = new MessageEmbed()
                    .setTitle("Entrainement terminé")
                    .setDescription("Voici le récapitulatif de votre entraînement :")
                    .addFields({
                      name: Util.strUcFirst(stat),
                      value: "+1",
                      inline: true
                    }, {
                      name: "Stamina",
                      value: "-20",
                      inline: true
                    }, {
                      name: "Blessé ?",
                      value: blessure,
                      inline: true
                    })
                    .setColor("GREEN")
                    .setThumbnail(playerData[0].profil);

                    Util.addStat(userId, idStat, 1, playerData[0].stamina, playerData[0])
                    
                  interaction.followUp({
                    embeds: [embedTrainingEnd],
                    components: [],
                    ephemeral: true
                  });
                }, 5000)
              });
          } else {
            interaction.reply({
              embeds: [Util.errorEmbed("Entrainement impossible", "Vous ne possedez pas de joueur")],
              ephemeral: true
            })
          }
    }
  }
}