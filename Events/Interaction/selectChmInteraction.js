const {
  MessageEmbed
} = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const Util = require('../../Utils/function')
const mongo = require('../../mongo');

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select') {
      const userId = interaction.member.user.id;
      const stat = interaction.values[0].split("_")[0]
      const idStat = interaction.values[0].split("_")[1]
      console.log(stat)
      console.log(idStat)
      let blessure = "Non"
      mongo().then(async (mongoosecplayer) => {
        try {
          const userObj = await playerSchema.findOne({
            userId,
          }, {
            userId: 1,
            _id: 0,
          });
          if (userObj !== null) {
            if(userObj.stamina < 20) {
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
              .setThumbnail(userObj.profil);
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
                      name: interaction.values[0],
                      value: "+1",
                      inline: true
                    }, {
                      name: "Stamina",
                      value: "-20",
                      inline: true
                    }, {
                      name: "Bléssé ?",
                      value: blessure,
                      inline: true
                    })
                    .setColor("GREEN")
                    .setThumbnail(userObj.profil);
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
        } catch(err) {
          console.log(err)
          console.log("Erreur commande club house manager: selectChmInteraction(83)")
          mongoosecplayer.connection.close()
        }
      })
    }
  }
}