const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  MessageAttachment,
  MessageActionRow,
  MessageSelectMenu,
  ChannelType
} = require("discord.js");
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
const LDLMTeam = require('../../Schemas/mysql/LDLMTeam');
const LDLMPlayer = require("../../Schemas/mysql/LDLMPlayer");


module.exports = {
  name: "ldlm",
  description: "La Ligue de la Muerte",
  options: [{
      name: "myteam",
      type: "SUB_COMMAND",
      description: "Affichez un résumé de votre équipe",
    },
    {
      name: "teams",
      type: "SUB_COMMAND",
      description: "Affichez la relation joueur - équipe",
    },
    {
      name: "search",
      type: "SUB_COMMAND",
      description: "Recherchez des informations sur un joueur",
      options: [{
        name: "nom",
        type: "STRING",
        required: true,
        description: "Saisissez le nom du joueur recherché",
        autocomplete: true
      }]
    },
    {
      name: "add",
      type: "SUB_COMMAND",
      description: "Recherchez des informations sur un joueur",
      options: [{
        name: "nom",
        type: "STRING",
        required: true,
        description: "Saisissez le nom du joueur que vous voulez ajouter",
        autocomplete: true
      }]
    },
    {
      name: "matchinfo",
      type: "SUB_COMMAND",
      description: "Informations de match",
      options: [{
          name: "domicile",
          type: "STRING",
          required: true,
          description: "L'équipe à domicile",
        },
        {
          name: "exterieur",
          type: "STRING",
          required: true,
          description: "L'équipe à l'extérieur",
        },
        {
          name: "score",
          type: "STRING",
          required: true,
          description: "Score final",
        },
        {
          name: "bedom",
          type: "STRING",
          required: true,
          description: "Buts encaissés de l'équipe à Domicile",
        },
        {
          name: "beext",
          type: "STRING",
          required: true,
          description: "Buts encaissés de l'équipe à l'extérieur",
        },
        {
          name: "bmdom",
          type: "STRING",
          required: true,
          description: "Buts marqués de l'équipe à Domicile",
        },
        {
          name: "bmext",
          type: "STRING",
          required: true,
          description: "Buts marqués de l'équipe à l'extérieur",
        },
        {
          name: "shootout",
          type: "STRING",
          required: false,
          description: "(Facultatif) Résultats tirs aux buts",
        }
      ]
    },

    /* {
      name: "gencal",
      type: "SUB_COMMAND",
      description: "Permet de générer un calendrier en determinant les jours de matchs",
      options: [{
        name: "days",
        type: "STRING",
        required: true,
        description: "Saisissez le nom de votre équipe",
        choices: [{
          name: "Lundi",
          value: "lundi"
        },
        {
          name: "Mardi",
          value: "mardi"
        },
        {
          name: "Mercredi",
          value: "mercredi"
        },
        {
          name: "Jeudi",
          value: "jeudi"
        },
        {
          name: "Vendredi",
          value: "vendredi"
        },
        {
          name: "Samedi",
          value: "samedi"
        },
        {
          name: "Dimanche",
          value: "dimanche"
        },
      ]
      }, ]
    } */
  ],
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction, client) {
    const {
      options,
      guild
    } = interaction;

    const userId = interaction.user.id
    const username = interaction.user.username

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "myteam": {
        break;
      }
      case "teams": {
        let teamsName = "";
        let budget = "";
        let owners = "";

        const someEmoji = client.emojis.cache.get("strasbourg");
        console.log(someEmoji)

        const teamsData = await LDLMTeam.getAllTeam()
        if (typeof teamsData[0] !== 'undefined') {
          const TeamEmbed = new MessageEmbed()
            .setTitle("Répartition des équipes")
            .setDescription("La ligue de la muerte débute, et pour vous y retrouver, voici les informations respectives des différentes équipes.");
          teamsData.forEach(function (team) {
            teamsName = teamsName + ` <:${team.icon}> ` + team.teamName + '\n'
            owners = owners + `<@${team.teamOwner}>` + '\n'
            budget = budget + team.budget + '\n'
          })
          TeamEmbed.addFields({
            name: "Nom d'équipe",
            value: `${teamsName}`,
            inline: true,
          }, {
            name: "Equipe de",
            value: `${owners}`,
            inline: true,
          }, {
            name: "Budget",
            value: `${budget}`,
            inline: true,
          });
          interaction.reply({
            embeds: [TeamEmbed]
          })
        }
        break;
      }

      case "search": {
        const nom = interaction.options.getString("nom")
        break

      }

      case "add": {
        const nom = interaction.options.getString("nom")
        const member = await guild.members.fetch(userId)
        const player = await LDLMPlayer.getPlayerByID(nom)
        const stats = await LDLMPlayer.getPlayerStats(nom)
        const playerTeam = await LDLMTeam.findTeamByPlayerID(nom)
        let teamName = "";
        if (member.roles.cache.has('1085594724477448224') === true) {
          if (typeof player[0] !== 'undefined') {
            if (typeof stats[0] !== 'undefined') {
                const playerEmbed = new MessageEmbed()
                .setTitle(stats[0].Forename + " " + stats[0].Surname)
                .setDescription("Voici la page de présentation de ce joueur ainsi que ses statistiques de la saison");
                if(stats[0].ImageURL !== 'NULL') {
                  playerEmbed.setThumbnail(stats[0].ImageURL);
                }
              if (typeof playerTeam[0] !== 'undefined') {
                playerEmbed.setFooter({text: `Ce joueur appartient à <@${playerTeam[0].teamOwner}> et joue à ${playerTeam[0].teamName}`})
              }
              else {
                playerEmbed.setFooter({text: `Ce joueur appartient n'appartient à aucune équipe`})
              }
              interaction.reply({
                embeds: [playerEmbed],
                ephemeral: true
              })
            }
          }
          else {
            interaction.reply({
              embeds: [new MessageEmbed().setTitle("Action impossible").setDescription("Le joueur recherché est introuvable").setColor("RED")],
              ephemeral: true
            })
          }
        } else {
          interaction.reply({
            embeds: [new MessageEmbed().setTitle("Action impossible").setDescription("Vous ne pouvez pas faire cette action car vous n'êtes pas un organisateur").setColor("RED")],
            ephemeral: true
          })
        }
        break

      }
    }

  }
}