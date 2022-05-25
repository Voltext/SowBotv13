const {
  CommandInteraction,
  MessageEmbed,
  MessageButton
} = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const teamsSchema = require('../../Schemas/teamsSchema')
const Util = require('../../Utils/function')
const mongo = require('../../mongo');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
  name: "chm",
  description: "Club house manager",
  permission: "ADMINISTRATOR",
  options: [{
      name: "myplayer",
      type: "SUB_COMMAND",
      description: "Affichez les stats de votre joueur",
    },
    {
      name: "entrainement",
      type: "SUB_COMMAND",
      description: "Entrainez votre joueur",
    },
    {
      name: "match",
      type: "SUB_COMMAND",
      description: "Testez votre joueur contre les autres joueurs",
      options: [{
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
          choices: [{
              name: "Oui",
              value: "oui"
            },
            {
              name: "Non",
              value: "non"
            }
          ]
        }
      ]
    },
    {
      name: "createplayer",
      type: "SUB_COMMAND",
      description: "Créez votre joueur",
      options: [{
        name: "poste",
        type: "STRING",
        required: true,
        description: "Choisissez le poste de votre joueur",
        choices: [{
            name: "Gardien",
            value: "gardien"
          },
          {
            name: "Défenseur",
            value: "defenseur"
          },
          {
            name: "Milieu",
            value: "milieu"
          },
          {
            name: "Attaquant",
            value: "attaquant"
          },
        ]
      }]
    },

    {
      name: "createteam",
      type: "SUB_COMMAND",
      description: "Créez votre équipe",
      options: [{
        name: "teamname",
        type: "STRING",
        required: true,
        description: "Saisissez le nom de votre équipe"
      }, ]
    },

    {
      name: "removeteam",
      type: "SUB_COMMAND",
      description: "Supprimer votre équipe",
    },

  ],
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction, client) {
    const {
      options,
      member,
      guild
    } = interaction;
    const userId = interaction.user.id

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "myplayer": {
        break;
      }
      case "entrainement": {
        break;
      }
      case "match": {
        break;
      }
      case "createplayer": {
        const poste = interaction.options.getString("poste")
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
                poste: poste,
                stat1: 65,
                stat2: 65,
                stat3: 65,
                stat4: 65,
                stat5: 65,
                stat6: 65,
                stamina: 100,
              });
              interaction.reply({
                embeds: [Util.successEmbed("Joueur créer", "Votre joueur a bien été créer")],
                ephemeral: true
              })
            } else {
              interaction.reply({
                embeds: [Util.errorEmbed("Création impossible", "Vous possedez déjà un joueur")],
                ephemeral: true
              })
            }
          } catch {
            mongoosecplayer.connection.close()
          }
        })
        break;
      }
      case "createteam": {
        console.log("Test1")
        const teamName = interaction.options.getString("teamname")
        const idCapitaine = userId
        mongo().then(async (mongooseteam) => {
          try {
            const teamObj = await teamsSchema.find({}, {
              idCapitaine: 1,
              teamName: 1,
              teamMembers: 1,
              _id: 0,
            });
            if (teamObj.length === 0) {
              const newMember = [userId.toString()]
              teamsSchema.create({
                idCapitaine: userId,
                teamName: teamName,
                teamMembers = newMember
              })
              interaction.reply({
                embeds: [Util.successEmbed("Equipe créée", `Votre équipe **${teamName}** a bien été créée`)],
                ephemeral: true
              })
            } else {
              console.log("Test3")
              teamObj.forEach(async team => {
                const memberArr = team.teamMembers
                if(team.idCapitaine === userId) {
                  console.log("Test4")
                  interaction.reply({
                    embeds: [Util.errorEmbed("Création impossible", `Vous possédez déjà une équipe : **${teamObj.teamName}**`)],
                    ephemeral: true
                  })
                }
                else {
                  const newMember = [userId.toString()]
                  teamsSchema.create({
                    idCapitaine: userId,
                    teamName: teamName,
                    teamMembers = newMember
                  })
                  interaction.reply({
                    embeds: [Util.successEmbed("Equipe créée", `Votre équipe **${teamName}** a bien été créée`)],
                    ephemeral: true
                  })
                }
                memberArr.forEach(member => {
                  if(member === userId) {
                    console.log("Test6")
                    interaction.reply({
                      embeds: [Util.errorEmbed("Création impossible", `Vous faites déjà parti d'une équipe : **${team.teamName}**`)],
                      ephemeral: true
                    })
                  }
                  else {
                    const newMember = [userId.toString()]
                    teamsSchema.create({
                      idCapitaine: userId,
                      teamName: teamName,
                      teamMembers = newMember
                    })
                    interaction.reply({
                      embeds: [Util.successEmbed("Equipe créée", `Votre équipe **${teamName}** a bien été créée`)],
                      ephemeral: true
                    })
                  }
                })
              })
            }
          } catch {
            mongooseteam.connection.close()
          }
        })
        break;
      }
      case "removeteam": {
        const modal = new Modal()
        .setCustomId('modal-customid')
        .setTitle("Supprimer votre équipe")
        .addComponents(
          new TextInputComponent() // We create a Text Input Component
          .setCustomId('textinput-customid')
          .setLabel('Raison')
          .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
          .setMinLength(4)
          .setMaxLength(500)
          .setPlaceholder('Expliquez pourquoi vous souhaitez supprimer votre équipe')
          .setRequired(true) // If it's required or not
        );

        showModal(modal, {
          client: client,
          interaction: interaction,
        });
        break;
      }
    }

  }
}