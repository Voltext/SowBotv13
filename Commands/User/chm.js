const { CommandInteraction, MessageEmbed } = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const Util = require('../../Utils/function')
const mongo = require('../../mongo');

module.exports = {
    name: "chm",
    description: "Club house manager",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "entrainement",
            type: "SUB_COMMAND",
            description: "Entrainez votre joueur",
        },
        {
            name: "match",
            type: "SUB_COMMAND",
            description: "Testez votre joueur contre les autres joueurs",
            options: [
                {
                    name: "member",
                    type: "USER",
                    required: true,
                    description: "Saisissez l'@ du membre que vous souhaitez affronter"
                },
                {
                  name: "isteam",
                  type: "STRING",
                  required: true,
                  description: "Souhaitez vous jouer contre une equipe",
                  choices: [
                      {name: "Oui", value: "oui"},
                      {name: "Non", value: "non"}
                  ]
              }
            ]
        },
        {
            name: "createplayer",
            type: "SUB_COMMAND",
            description: "Créez votre joueur",
        },

        {
          name: "createteam",
          type: "SUB_COMMAND",
          description: "Créez votre équipe",
          options: [
            {
                name: "teamname",
                type: "STRING",
                required: true,
                description: "Saisissez le nom de votre équipe"
            },
        ]
      },
        
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
  async execute(interaction) {
    const { options, member, guild } = interaction;
    const userId = interaction.user.id
        
    const subCommand = options.getSubcommand();

    switch(subCommand) {
      case "entrainement": {
        break;
      }
      case "match": {
        break;
      }
      case "createplayer": {
        mongo().then(async (mongoosecplayer) => {
          try {
              const userObj = await playerSchema.findOne({
                  userId,
              }, {
                  userId: 1,
                  _id: 0,
              });
              if (userObj === null) {
                playerSchema.create({
                  userId: userId,
                  stat1: 65,
                  stat2: 65,
                  stat3: 65,
                  stat4: 65,
                  stat5: 65,
                  stat6: 65,
                  stamina: 100,
                });
                interaction.reply({
                  embeds: [Util.successEmbed("Joueur créer", "Votre joueur a bien été créer")]
                })
              }
              else {
                  interaction.reply({
                    embeds: [Util.errorEmbed("Création impossible", "Vous possedez déjà un joueur")]
                  })
              }
          } catch {
            mongoosecplayer.connection.close()
          }
      })
        break;
      }
      case "createteam": {
        break;
      }
    }

  }
}