const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  MessageAttachment,
  MessageActionRow,
  MessageSelectMenu
} = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const {Teams} = require('../../Schemas/teamsSchema')
const teamPlayerSchema = require('../../Schemas/teamPlayerSchema')
const Util = require('../../Utils/function')
const mongo = require('../../mongo');
const {
  Modal,
  TextInputComponent,
  showModal
} = require('discord-modals');
const Chart = require('chart.js');
const {
  ChartJSNodeCanvas
} = require("chartjs-node-canvas");
const toonavatar = require('cartoon-avatar');
const progressbar = require('string-progressbar');
const Thread = require("../../Api/threadsForum")

module.exports = {
  name: "chm",
  description: "Club house manager",
  permission: "KICK_MEMBERS",
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
        },
        {
          name: "genre",
          type: "STRING",
          required: true,
          description: "Saisissez une description de votre event",
          choices: [{
              name: "Homme",
              value: "homme"
            },
            {
              name: "Femme",
              value: "femme"
            }
          ]
        }
      ]
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
         name: "transfert",
         type: "SUB_COMMAND",
         description: "Supprimer votre équipe",
         options: [{
          name: "member",
          type: "USER",
          required: true,
          description: "Saisissez la personne à vendre"
        }, {
          name: "channel",
          type: "CHANNEL",
          required: true,
          description: "Saisissez la personne à vendre"
        },{
          name: "valeur",
          type: "STRING",
          required: true,
          description: "Saisissez la personne à vendre"
        }, ]
       },

    // {
    //   name: "leaveteam",
    //   type: "SUB_COMMAND",
    //   description: "Supprimer votre équipe",
    // },

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
    const username = interaction.user.username
    let recruteurRole = guild.roles.cache.get(process.env.RECRUTEURS);

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "myplayer": {
        let keysChart = "";
        let etat = ""
        let color = ""
        const canvas = new ChartJSNodeCanvas({
          width: 800,
          height: 600,
          backgroundColour: 'white'
        })
        mongo().then(async (mongoosecplayer) => {
          try {
            const userObj = await playerSchema.findOne({
              userId,
            }, {});
            if (userObj !== null) {
              var total = 100;
              var current = userObj.stamina;

              if(userObj.isInjured === true) {
                etat = "Blessé"
                color = "RED"
              }
              else {
                etat = "En forme"
                color = "GREEN"
              }

              if (userObj.poste === "attaquant") {
                keysChart = ["Vitesse", "Passe", "Tirs", "Physique", "Drible", "Défense"];
              }
              if (userObj.poste === "milieu") {
                keysChart = ["Vitesse", "Passe", "Tirs", "Physique", "Drible", "Défense"];
              }
              if (userObj.poste === "defenseur") {
                keysChart = ["Vitesse", "Passe", "Tacle", "Physique", "Drible", "Défense"];
              }
              if (userObj.poste === "gardien") {
                keysChart = ["Plongeon", "Jeu main", "Dégagement", "Reflexes", "Vitesse", "Placement"];
              }
              const configuration = {
                type: "polarArea",
                data: {
                  labels: keysChart,
                  datasets: [{
                    label: `Vos statistiques`,
                    data: [userObj.stat1, userObj.stat2, userObj.stat3, userObj.stat4, userObj.stat5, userObj.stat6],
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(75, 192, 192)',
                      'rgb(255, 205, 86)',
                      'rgb(201, 203, 207)',
                      'rgb(195, 95, 207)',
                      'rgb(54, 162, 235)'
                    ]
                  }]
                }
              }

              const image = await canvas.renderToBuffer(configuration)

              const attachement = new MessageAttachment(image, "graph.png")

              const statEmbed = new MessageEmbed()
                .setTitle("Les statistiques de votre joueur : " + username)
                .setDescription("Vous pouvez augmenter vos statistiques en utilisant la commande `/chm entrainement`")
                .setThumbnail(userObj.profil)
                .setColor(color)
                .setFooter({
                  text: "Stamina actuelle : " + progressbar.filledBar(total, current, 20)[0] + " " + progressbar.filledBar(total, current)[1] + "/100"
                })
                .setImage("attachment://graph.png")
                .addFields({
                  name: keysChart[0],
                  value: userObj.stat1.toString(),
                  inline: true
                }, {
                  name: keysChart[1],
                  value: userObj.stat2.toString(),
                  inline: true
                }, {
                  name: keysChart[2],
                  value: userObj.stat3.toString(),
                  inline: true
                }, {
                  name: keysChart[3],
                  value: userObj.stat4.toString(),
                  inline: true
                }, {
                  name: keysChart[4],
                  value: userObj.stat5.toString(),
                  inline: true
                }, {
                  name: keysChart[5],
                  value: userObj.stat6.toString(),
                  inline: true
                }, {
                  name: "Etat de santé",
                  value: etat,
                  inline: true
                }, {
                  name: "Succès",
                  value: userObj.succes.toString(),
                  inline: true
                })

              interaction.reply({
                embeds: [statEmbed],
                files: [attachement],
                ephemeral: true,
              })
            } else {
              interaction.reply({
                embeds: [Util.errorEmbed("Création impossible", "Vous ne possedez pas de joueur")],
                ephemeral: true
              })
            }
          } catch (err) {
            console.log("Erreur commande club house manager: chm(183)")
            console.log(err)
            mongoosecplayer.connection.close()
          }
        })
        break;
      }
      case "entrainement": {
        const embedSelect = new MessageEmbed();
        mongo().then(async (mongoosecplayer) => {
          try {
            const userObj = await playerSchema.findOne({
              userId,
            }, {});
            if (userObj !== null) {
              if(userObj.isInjured === true) {
                etat = "Blessé"
              }
              else {
                etat = "En forme"
              }
              if(userObj.stamina === 0 || userObj.isInjured === true) {
                embedSelect.setTitle("Attention !").setDescription("Votre état de forme ne vous permet pas de vous entrainer").addField("Votre stamina", userObj.stamina.toString()).addField("Etat de santé", etat).setColor("RED");
                interaction.reply({
                  embeds: [embedSelect],
                  ephemeral: true
                })
              }
              else {
                if(userObj.stamina < 20 && userObj.stamina > 0) {
                  embedSelect.setTitle("Attention !").setDescription("Votre niveau de Stamina est faible, vous risquez de vous blesser à l'issu de votre entraînement...").setColor("RED");
                }
                else {
                  embedSelect.setTitle("Tout est bon !").setDescription("Vous êtes dans une forme correcte pour vous entrainer").setColor("GREEN");
                }
              const row = new MessageActionRow()
                .addComponents(
                  new MessageSelectMenu()
                  .setCustomId('select')
                  .setPlaceholder('Choisissez la statistique que vous souhaitez travailler'));
              if (userObj.poste === "attaquant") {
                row.components[0].addOptions([{
                  label: `Vitesse`,
                  description: `Augmenter la vitesse de son joueur`,
                  value: `vitesse_stat1`,
                }, {
                  label: `Passe`,
                  description: `Augmenter les passes de son joueur`,
                  value: `passe_stat2`,
                }, {
                  label: `Tirs`,
                  description: `Augmenter les tirs de son joueur`,
                  value: `tirs_stat3`,
                }, {
                  label: `Physique`,
                  description: `Augmenter le physique de son joueur`,
                  value: `physique_stat4`,
                }, {
                  label: `Dribble`,
                  description: `Augmenter les dribbles de son joueur`,
                  value: `dribble_stat5`,
                }, {
                  label: `Défense`,
                  description: `Augmenter la défense de son joueur`,
                  value: `defense_stat6`,
                }, ]);
              }
              if (userObj.poste === "milieu") {
                row.components[0].addOptions([{
                  label: `Vitesse`,
                  description: `Augmenter la vitesse de son joueur`,
                  value: `vitesse_stat1`,
                }, {
                  label: `Passe`,
                  description: `Augmenter les passes de son joueur`,
                  value: `passe_stat2`,
                }, {
                  label: `Tirs`,
                  description: `Augmenter les tirs de son joueur`,
                  value: `tirs_stat3`,
                }, {
                  label: `Physique`,
                  description: `Augmenter le physique de son joueur`,
                  value: `physique_stat4`,
                }, {
                  label: `Dribble`,
                  description: `Augmenter les dribbles de son joueur`,
                  value: `dribble_stat5`,
                }, {
                  label: `Défense`,
                  description: `Augmenter la défense de son joueur`,
                  value: `defense_stat6`,
                }, ]);
              }
              if (userObj.poste === "defenseur") {
                row.components[0].addOptions([{
                  label: `Vitesse`,
                  description: `Augmenter la vitesse de son joueur`,
                  value: `vitesse_stat1`,
                }, {
                  label: `Passe`,
                  description: `Augmenter les passes de son joueur`,
                  value: `passe_stat2`,
                }, {
                  label: `Tacle`,
                  description: `Augmenter les tacles de son joueur`,
                  value: `tacle_stat3`,
                }, {
                  label: `Physique`,
                  description: `Augmenter le physique de son joueur`,
                  value: `physique_stat4`,
                }, {
                  label: `Dribble`,
                  description: `Augmenter les dribbles de son joueur`,
                  value: `dribble_stat5`,
                }, {
                  label: `Défense`,
                  description: `Augmenter la défense de son joueur`,
                  value: `defense_stat6`,
                }, ]);
              }
              if (userObj.poste === "gardien") {
                row.components[0].addOptions([{
                  label: `Plongeon`,
                  description: `Augmenter les plongeons de son joueur`,
                  value: `plongeon_stat1`,
                }, {
                  label: `Jeu main`,
                  description: `Augmenter le jeu de main de son joueur`,
                  value: `jeu main_stat2`,
                }, {
                  label: `Dégagement`,
                  description: `Augmenter les dégagements de son joueur`,
                  value: `dégagement_stat3`,
                }, {
                  label: `Reflexes`,
                  description: `Augmenter les reflexes de son joueur`,
                  value: `reflexes_stat4`,
                }, {
                  label: `Vitesse`,
                  description: `Augmenter la vitesse de son joueur`,
                  value: `vitesse_stat5`,
                }, {
                  label: `Placement`,
                  description: `Augmenter le placement de son joueur`,
                  value: `placement_stat6`,
                }, ]);
              }
              interaction.reply({
                components: [row],
                embeds: [embedSelect],
                ephemeral: true
              })
            }
            } else {
              interaction.reply({
                embeds: [Util.errorEmbed("Entrainement impossible", "Vous ne possedez pas de joueur.")],
                ephemeral: true
              })
            }
          } catch (err) {
            console.log("Erreur commande club house manager: chm(381)")
            console.log(err)
            mongoosecplayer.connection.close()
          }
        })
        break;
      }
      case "match": {
        break;
      }
      case "createplayer": {
        const poste = interaction.options.getString("poste")
        const genre = interaction.options.getString("genre")
        let gender = ""
        if (genre === "homme") {
          gender = "male"
        } else {
          gender = "female"
        }
        const profil = toonavatar.generate_avatar({
          "gender": gender
        });
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
                genre: genre,
                profil: profil,
                isInjured: false,
                succes: 0,
                stat1: 65,
                stat2: 65,
                stat3: 65,
                stat4: 65,
                stat5: 65,
                stat6: 65,
                stamina: 100,
              });
              interaction.reply({
                embeds: [Util.successEmbed("Joueur crée", "Votre joueur a bien été crée")],
                ephemeral: true
              })
            } else {
              interaction.reply({
                embeds: [Util.errorEmbed("Création impossible", "Vous possedez déjà un joueur")],
                ephemeral: true
              })
            }
          } catch {
            console.log("Erreur commande club house manager: chm(183)")
            mongoosecplayer.connection.close()
          }
        })
        break;
      }
      case "createteam": {
        const teamName = interaction.options.getString("teamname")
        mongo().then(async (mongoosecplayer) => {
          try {
            const userObj = await playerSchema.findOne({
              userId,
            });
            if (userObj !== null) {
              if(userObj.succes < 50) {
                interaction.reply({
                  embeds: [Util.errorEmbed("Création impossible", "Vous n'avez pas suffisamment de point de succès pour créer votre équipe. Il vous faut minimum 50 points de succès")],
                  ephemeral: true
                })
              }
              else {
                mongo().then(async (mongooseteam) => {
                  try {
                    const teamObj = await Teams.find({}, {
                      idCapitaine: 1,
                      teamName: 1,
                      budget: 1,
                      _id: 0,
                    });
                    if (teamObj.length === 0) {
                      const capitaine = await guild.members.fetch(userId);
                      capitaine.roles.add(recruteurRole)

                      Teams.create({
                        idCapitaine: userId,
                        teamName: teamName,
                        budget: 10000000
                      }).then(team => {
                        teamPlayerSchema.create({
                          team: team,
                          userId: userId,
                        })
                      })

                      interaction.reply({
                        embeds: [Util.successEmbed("Equipe créée", `Votre équipe **${teamName}** a bien été créée. Vous avez dorénavant accès au salon <#${process.env.INFO_RECRUTEUR}>`)],
                        ephemeral: true
                      })
                    } else {
                      const userObj = await teamPlayerSchema.findOne({
                        userId,
                      });

                      if(userObj.length === 0) {
                        Teams.create({
                          idCapitaine: userId,
                          teamName: teamName,
                          budget: 10000000
                        }).then(team => {
                          teamPlayerSchema.create({
                            team: team,
                            userId: userId,
                          })
                        })

                        interaction.reply({
                          embeds: [Util.successEmbed("Equipe créée", `Votre équipe **${teamName}** a bien été créée. Vous avez dorénavant accès au salon <#${process.env.INFO_RECRUTEUR}>`)],
                          ephemeral: true
                        })
                      }
                      else {
                        interaction.reply({
                          embeds: [Util.errorEmbed("Création impossible", `Impossible de créer une équipe car vous faites déjà partie de : **${userObj.team.teamName}**`)],
                          ephemeral: true
                        })
                      }
                    }
                  } catch(err) {
                    console.log(err)
                    console.log("Erreur commande club house manager: chm(222)")
                    mongooseteam.connection.close()
                  }
                })
              }
            }
            else {
              interaction.reply({
                embeds: [Util.errorEmbed("Création impossible", `Vous n'avez pas de joueur crée`)],
                ephemeral: true
              })
            }
            
          } catch {
            console.log("Erreur commande club house manager: chm(183)")
            mongoosecplayer.connection.close()
          }
        })
        
        break;
      }

      case "transfert": {
        headers = {
          'Authorization': 'Bot ' + process.env.TOKEN_SOW,
          'Content-Type': 'application/json'
        }

        dataCards = {
          message : {
              "content": "Test"
          },
          name: "En cours..."
      }

        axios.post(`https://discord.com/api/channels/1020265346877374534/threads`, dataCards, {
          'headers': headers
        }).then(resp => {
          console.log(resp.data);
        }).catch(err => console.error(err))

        break;
      }
      // case "leaveteam": {
      //   const modal = new Modal()
      //     .setCustomId('modal-customid')
      //     .setTitle("Quitter votre équipe")
      //     .addComponents(
      //       new TextInputComponent() // We create a Text Input Component
      //       .setCustomId('textinput-customid')
      //       .setLabel('Raison')
      //       .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
      //       .setMinLength(4)
      //       .setMaxLength(500)
      //       .setPlaceholder('Expliquez pourquoi vous souhaitez quitter votre équipe')
      //       .setRequired(true) // If it's required or not
      //     );

      //   showModal(modal, {
      //     client: client,
      //     interaction: interaction,
      //   });

      //   mongo().then(async (mongooseteam) => {
      //     try {
      //       const teamObj = await teamsSchema.find({}, {
      //         idCapitaine: 1,
      //         teamName: 1,
      //         teamMembers: 1,
      //         _id: 1,
      //       }).exec();
      //     } catch (err) {
      //       console.log("Erreur commande club house manager: chm(222)")
      //       console.log(err)
      //       mongooseteam.connection.close()
      //     }
      //   })
      //   break;
      // }
    }

  }
}