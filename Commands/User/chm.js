const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  MessageAttachment,
  MessageActionRow,
  MessageSelectMenu,
  ChannelType
} = require("discord.js");
const playerSchema = require('../../Schemas/playerSchema')
const {
  Teams
} = require('../../Schemas/teamsSchema')
const teamPlayerSchema = require('../../Schemas/teamPlayerSchema')
const transfertSchema = require('../../Schemas/transfertSchema')
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
const axios = require('axios')
const {
  registerFont,
  createCanvas,
  loadImage
} = require("canvas")
const path = require('path');
registerFont('./Assets/Fonts/DINNextLTPro-Black.ttf', {
  family: 'DINNextLTPro-Black'
})
registerFont('./Assets/Fonts/DINNextLTPro-UltraLightIt.ttf', {
  family: 'DINNextLTPro-UltraLightIt'
})
registerFont('./Assets/Fonts/DINNextRoundedLTPro-Bold.ttf', {
  family: 'DINNextRoundedLTPro-Bold'
})
const FormData = require('form-data');
const fs = require('fs');
const PlayerMysql = require('../../Schemas/mysql/PlayerMysql')


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
      name: "offre",
      type: "SUB_COMMAND",
      description: "Lancer une demande de transfert",
      options: [{
        name: "member",
        type: "USER",
        required: true,
        description: "Saisissez la personne à vendre"
      }, {
        name: "valeur",
        type: "STRING",
        required: true,
        description: "Saisissez la vakeur de la personne à vendre"
      }, ]
    },

    {
      name: "transfert",
      type: "SUB_COMMAND",
      description: "Accepter l'offre de transfert",
      options: [{
        name: "member",
        type: "USER",
        required: true,
        description: "Joueur concerné par le transfert"
      }, {
        name: "reponse",
        type: "STRING",
        required: true,
        description: "Reponse à l'offre proposée",
        choices: [{
            name: "Validé",
            value: "valide"
          },
          {
            name: "Refusé",
            value: "refus"
          }
        ]
      }]
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
        const playerData = await PlayerMysql.getPlayer(userId)
        console.log(playerData)
            if (playerData[0] !== "") {
              var total = 100;
              var current = playerData[0].stamina;

              if (playerData[0].isInjured === 1) {
                etat = "Blessé"
                color = "RED"
              } else {
                etat = "En forme"
                color = "GREEN"
              }

              if (playerData[0].poste == "attaquant") {
                keysChart = ["Vitesse", "Passe", "Tirs", "Physique", "Drible", "Défense"];
              }
              if (playerData[0].poste == "milieu") {
                keysChart = ["Vitesse", "Passe", "Tirs", "Physique", "Drible", "Défense"];
              }
              if (playerData[0].poste == "defenseur") {
                keysChart = ["Vitesse", "Passe", "Tacle", "Physique", "Drible", "Défense"];
              }
              if (playerData[0].poste == "gardien") {
                keysChart = ["Plongeon", "Jeu main", "Dégagement", "Reflexes", "Vitesse", "Placement"];
              }
              const configuration = {
                type: "polarArea",
                data: {
                  labels: keysChart,
                  datasets: [{
                    label: `Vos statistiques`,
                    data: [playerData[0].stat1, playerData[0].stat2, playerData[0].stat3, playerData[0].stat4, playerData[0].stat5, playerData[0].stat6],
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
                .setThumbnail(playerData[0].profil)
                .setColor(color)
                .setFooter({
                  text: "Stamina actuelle : " + progressbar.filledBar(total, current, 20)[0] + " " + progressbar.filledBar(total, current)[1] + "/100"
                })
                .setImage("attachment://graph.png")
                .addFields({
                  name: keysChart[0],
                  value: playerData[0].stat1.toString(),
                  inline: true
                }, {
                  name: keysChart[1],
                  value: playerData[0].stat2.toString(),
                  inline: true
                }, {
                  name: keysChart[2],
                  value: playerData[0].stat3.toString(),
                  inline: true
                }, {
                  name: keysChart[3],
                  value: playerData[0].stat4.toString(),
                  inline: true
                }, {
                  name: keysChart[4],
                  value: playerData[0].stat5.toString(),
                  inline: true
                }, {
                  name: keysChart[5],
                  value: playerData[0].stat6.toString(),
                  inline: true
                }, {
                  name: "Etat de santé",
                  value: etat,
                  inline: true
                }, {
                  name: "Succès",
                  value: playerData[0].success.toString(),
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
        break;
      }
      case "entrainement": {
        const embedSelect = new MessageEmbed();
        const playerData = await PlayerMysql.getPlayer(userId)
            if (playerData[0] !== "") {
              if (playerData[0].isInjured === 1) {
                etat = "Blessé"
              } else {
                etat = "En forme"
              }
              if (playerData[0].stamina === 0 || playerData[0].isInjured === true) {
                embedSelect.setTitle("Attention !").setDescription("Votre état de forme ne vous permet pas de vous entrainer").addField("Votre stamina", playerData[0].stamina.toString()).addField("Etat de santé", etat).setColor("RED");
                interaction.reply({
                  embeds: [embedSelect],
                  ephemeral: true
                })
              } else {
                if (playerData[0].stamina < 20 && playerData[0].stamina > 0) {
                  embedSelect.setTitle("Attention !").setDescription("Votre niveau de Stamina est faible, vous risquez de vous blesser à l'issu de votre entraînement...").setColor("RED");
                } else {
                  embedSelect.setTitle("Tout est bon !").setDescription("Vous êtes dans une forme correcte pour vous entrainer").setColor("GREEN");
                }
                const row = new MessageActionRow()
                  .addComponents(
                    new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Choisissez la statistique que vous souhaitez travailler'));
                if (playerData[0].poste === "attaquant") {
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
                if (playerData[0].poste === "milieu") {
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
                if (playerData[0].poste === "defenseur") {
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
                if (playerData[0].poste === "gardien") {
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
        break;
      }
      case "match": {
        break;
      }
      case "createplayer": {
        const poste = interaction.options.getString("poste")
        const genre = interaction.options.getString("genre")
        const playerData = await PlayerMysql.getPlayer(userId)
        let gender = ""
        if (genre === "homme") {
          gender = "male"
        } else {
          gender = "female"
        }
        const profil = toonavatar.generate_avatar({
          "gender": gender
        });
        console.log(playerData[0])
            if (playerData[0] == "") {
              const playerInsert = await PlayerMysql.insertPlayer(userId, poste, genre, profil)
              console.log(playerInsert)
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
              if (userObj.succes < 50) {
                interaction.reply({
                  embeds: [Util.errorEmbed("Création impossible", "Vous n'avez pas suffisamment de point de succès pour créer votre équipe. Il vous faut minimum 50 points de succès")],
                  ephemeral: true
                })
              } else {
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

                      if (userObj.length === 0) {
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
                        interaction.reply({
                          embeds: [Util.errorEmbed("Création impossible", `Impossible de créer une équipe car vous faites déjà partie de : **${userObj.team.teamName}**`)],
                          ephemeral: true
                        })
                      }
                    }
                  } catch (err) {
                    console.log(err)
                    console.log("Erreur commande club house manager: chm(222)")
                    mongooseteam.connection.close()
                  }
                })
              }
            } else {
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

      case "offre": {
        const user = interaction.options.getUser('member');
        const budget = interaction.options.getString('valeur');
        const channel = guild.channels.cache.get(process.env.CHMJOUEUR);

        const receveur = user.id

        mongo().then(async (mongoosecplayer) => {
          try {
            const userObj = await Teams.findOne({
              userId,
            });
            if (userObj === null) {
              interaction.reply({
                embeds: [Util.errorEmbed("Transfert impossible", "Vous ne possedez pas d'équipe")],
                ephemeral: true
              })
            } else {
              if ((userObj.budget - Number(budget)) < 0) {
                interaction.reply({
                  embeds: [Util.errorEmbed("Transfert impossible", "Vous n'avez pas le budget suffisant pour ce transfert. Votre budget actuel est de **" + userObj.budget + "**")],
                  ephemeral: true
                })
              } else {

                mongo().then(async (mongoosecplayerteam) => {
                  try {
                    const userObjPlayer = await teamPlayerSchema.findOne({
                      userId: receveur,
                    });
                    if (userObjPlayer === null) {
                      const thread = await channel.threads.create({
                        name: `${username} souhaite transférer ${user.username} pour ${budget}`,
                        type: 'GUILD_PRIVATE_THREAD',
                        content: `Les discussions sont lancées entre <@${userId}> et <@${user.id}>.`
                      });

                      await thread.members.add(userId);
                      await thread.members.add(user.id);

                      transfertSchema.create({
                        demandeurId: userId,
                        receveurId: user.id,
                        joueurId: user.id,
                        joueurName: user.username,
                        montant: budget,
                        threadId: thread.id
                      })

                      interaction.reply({
                        embeds: [Util.successEmbed("Transfert en cours", "Les discussions sont lancées entre vous et le joueur libre")],
                        ephemeral: true
                      })
                    } else {
                      const thread = await channel.threads.create({
                        name: `${username} souhaite transférer ${user.username} pour ${budget}`,
                        type: 'GUILD_PRIVATE_THREAD',
                        content: `Les discussions sont lancées entre <@${userId}> et <@${user.id}>.`
                      });

                      await thread.members.add(userId);
                      await thread.members.add(user.id);
                      await thread.members.add(userObjPlayer.team.idCapitaine);

                      transfertSchema.create({
                        demandeurId: userId,
                        receveurId: userObjPlayer.team.idCapitaine,
                        joueurId: user.id,
                        joueurName: user.username,
                        montant: budget,
                        threadId: thread.id
                      })

                      interaction.reply({
                        embeds: [Util.successEmbed("Transfert en cours", "Les discussions sont lancées entre vous, le joueur et son capitaine")],
                        ephemeral: true
                      })
                    }
                  } catch (err) {
                    console.log(err)
                    console.log("Erreur commande club house manager: chm(183)")
                    mongoosecplayerteam.connection.close()
                  }
                })
                /* headers = {
                'Authorization': 'Bot ' + process.env.BOT_TOKEN,
                'Content-Type': 'application/json'
              }
      
              dataCards = {
                "message" : {
                    "content": `Les discussions sont lancées entre <@${userId}> et <@${user.id}>.`
                },
                "name": `${username} souhaite transférer ${user.username} pour ${budget}`
            }
      
              axios.post(`https://discord.com/api/channels/1020265346877374534/threads`, dataCards, {
                'headers': headers
              }).then(resp => {
                resp.permissionOverwrites.edit(user, {SEND_MESSAGES: true});
              }).catch(err => console.error(err))
              interaction.reply({
                embeds: [Util.successEmbed("Demande de transfert envoyée", "Un fil vient de se créer dans <#1020265346877374534>")],
                ephemeral: true
              })
              */
              }
            }
          } catch (err) {
            console.log(err)
            console.log("Erreur commande club house manager: chm(183)")
            mongoosecplayer.connection.close()
          }
        })

        break;
      }

      case "transfert": {
        const joueur = interaction.options.getUser("member")
        const reponse = interaction.options.getString('reponse')
        const channelD = guild.channels.cache.get(process.env.CHMJOUEUR);

        const joueurId = joueur.id

        const titreMot = ["Surprenant", "Colossal", "Etonnant", "Attendu", "Incroyable"]

        const canvas = createCanvas(793, 1020)
        const ctx = canvas.getContext('2d')

        const background = await loadImage(
          path.join(__dirname, `../../Assets/Base/ekipe.png`)
        )

        let x = 0
        let y = 0
        ctx.drawImage(background, x, y)

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = "center"
        ctx.font = '50px DINNextLTPro-Black'
        let scoreG = titreMot[Math.floor(Math.random() * titreMot.length)]
        ctx.fillText(scoreG, 175, 210)

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(`./Assets/ekipe.png`, buffer)

        mongo().then(async (mongoosectransfert) => {
          try {
            const userObj = await transfertSchema.findOne({
              receveurId: userId,
              joueurId
            });
            if (userObj !== null) {
              if (reponse === "valide") {
                mongo().then(async (mongoosectransfert) => {
                  try {
                    const userObjTeamPlayer = await teamPlayerSchema.findOne({
                      userId: userObj.demandeurId,
                    });
                    if (userObjTeamPlayer !== null) {
                      const team = userObjTeamPlayer.team
                      mongo().then(async (mongoosectransfert) => {
                        try {
                          await teamPlayerSchema.findOneAndUpdate({
                            userId: userObj.joueurId,
                          }, {
                            userId: userObj.joueurId,
                            team
                          }, {
                            upsert: true,
                          });
                          await Teams.findOneAndUpdate({
                            idCapitaine: userObj.demandeurId,
                          }, {
                            $inc: {
                              budget: -userObj.montant
                            }
                          });


                          dataCards = {
                            "message": {
                              "content": "Revue de presse",
                            },
                            "name": `[NOUVEAU TRANSFERT] ${userObj.joueurName} a rejoint ${userObjTeamPlayer.team.teamName} pour ${userObj.montant}`
                          }

                          const image = await fs.readFileSync(path.join(__dirname, "../../Assets/ekipe.png"));

                          var formData = new FormData();
                          formData.append('files[0]', image, "file.png");
                          formData.append('payload_json', JSON.stringify(dataCards));

                          axios({
                            url: `https://discord.com/api/channels/1020265346877374534/threads`,
                            method: 'POST',
                            data: formData,
                            headers: {
                              ...formData.getHeaders(),
                              'Authorization': 'Bot ' + process.env.BOT_TOKEN,
                              'Content-Type': 'multipart/form-data',
                            },
                          }).then(() => {
                            const thread = channelD.threads.cache.find(x => x.id === userObj.threadId);
                            thread.delete();
                          }).catch((error) => {
                            if( error.response ){
                                console.log(error.response.data); // => the response payload 
                            }
                        });
                        } catch (err) {
                          console.log(err)
                          console.log("Erreur commande club house manager: chm(183)")
                          mongoosectransfert.connection.close()
                        }
                      })
                    } else {
                      interaction.reply({
                        embeds: [Util.errorEmbed("Transfert impossible", "La personne à l'initative de ce transfert n'a pas d'équipe")],
                        ephemeral: true
                      })
                    }
                  } catch (err) {
                    console.log(err)
                    console.log("Erreur commande club house manager: chm(183)")
                    mongoosectransfert.connection.close()
                  }
                })
                interaction.reply({
                  embeds: [Util.successEmbed("Transfert validé", "Le joueur a bien été transferé")],
                  ephemeral: true
                })
              } else {
                interaction.reply({
                  embeds: [Util.errorEmbed("Transfert refusé", "Le transfert n'a pas abouti à une réponse positive. Le joueur reste donc dans son club actuel.")],
                  ephemeral: true
                })
              }

            } else {
              interaction.reply({
                embeds: [Util.errorEmbed("Transfert impossible", "Le transfert que vous tentez d'accepter n'existe pas / plus")],
                ephemeral: true
              })
            }
          } catch (err) {
            console.log(err)
            console.log("Erreur commande club house manager: chm(183)")
            mongoosectransfert.connection.close()
          }
        })

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