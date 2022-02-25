const {
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
require('dotenv').config();
const teamBDD = require("../../Game/Json/team.json")
const clubBDD = require("../../Game/Json/club.json")
//const goalStrikerBDD = require("../../Game/Json/goalstriker.json")

function filtreTexte(arr, requete) {
  return arr.filter(function (el) {
    return el.toLowerCase().indexOf(requete.toLowerCase()) !== -1;
  })
}

module.exports = {
  name: "event",
  description: "Permet de lancer un evenement d'animation",
  permission: "KICK_MEMBERS",
  options: [{
    name: "new",
    description: "Créer un event",
    type: "SUB_COMMAND",
    options: [{
        name: "type",
        description: "Le type d'event que vous souhaitez créer",
        type: "STRING",
        require: true,
        choices: [{
            name: "Devine l'equipe avec les drapeaux",
            value: "drapeaux"
          },
          {
            name: "Devine joueur par les clubs passés",
            value: "joueur"
          },
          {
            name: "Devine l'equipe avec l'attaquant et le goal",
            value: "goal"
          },
        ]
      },
      {
        name: "valeur",
        description: "Saisissez la valeur de l'event",
        type: "STRING",
        require: true,
      },
    ]
  }],

  async execute(interaction) {

    const { guild } = interaction;

    const value = interaction.options.getString("valeur");
    let color = "";
    let sec = "";
    let time = 0;
    let libelle = "";

    if (interaction.options.getString('type') === "drapeaux") {

      if (teamBDD[0].hasOwnProperty(value)) {
        const id = teamBDD[0][value][0]["id"];
        const imgTeam = teamBDD[0][value][0]["image"];
        const nomTeam = teamBDD[0][value][0]["nom"];
        const difficulty = teamBDD[0][value][0]["difficulty"];

        const img = new MessageAttachment(imgTeam);

        if (difficulty === 1) {
          libelle = "FACILE"
          color = "GREEN";
          sec = "30 secondes";
          time = 30000
        } else if (difficulty === 2) {
          libelle = "MOYEN"
          color = "ORANGE";
          sec = "20 secondes";
          time = 20000
        } else if (difficulty === 3) {
          libelle = "DIFFICILE"
          color = "RED";
          sec = "12 secondes";
          time = 12000
        } else if (difficulty === 4) {
          libelle = "EXTREME"
          color = "DARK_BUT_NOT_BLACK";
          sec = "10 secondes";
          time = 10000;
        }

        const embed = new MessageEmbed()
          .setColor(color)
          .setAuthor(`Difficulté : ${libelle}`)
          .setTitle("Devinez l'équipe en fonction de la nationalité des joueurs")
          .setDescription(`Vous avez ${sec}`)
          .setImage(`attachment://${id}.png`);

        const filter = (m) => nomTeam.includes(m.content.toLowerCase())

        guild.channels.cache.get(process.env.EVENT).send({
          embeds: [embed],
          files: [img]
      })

        interaction.reply({
            content: "Qui est cette équipe ?",
            ephemeral: true
          })
          .then(() => {
            interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: time
              })
              .then(collected => {
                const winner = collected.first().author.id
                interaction.followUp(`Félicitations <@${winner}> ! `)
              })
              .catch(collected => {
                interaction.followUp(`Personne n'a trouvé la solution dans le temps imparti. La bonne réponse était : ${value}`)
              })
          })
      } else {
        interaction.reply({
          content: "L'équipe demandée n'existe pas",
          ephemeral: true
        })
      }
    }
    if (interaction.options.getString('type') === "joueur") {
      if (clubBDD[0].hasOwnProperty(value)) {
        const id = clubBDD[0][value][0]["id"];
        const imgJoueur = clubBDD[0][value][0]["image"];
        const nomJoueur = clubBDD[0][value][0]["nom"];
        const difficulty = clubBDD[0][value][0]["difficulty"];

        const img = new MessageAttachment(imgJoueur);

        if (difficulty === 1) {
          libelle = "FACILE"
          color = "GREEN";
          sec = "30 secondes";
          time = 30000
        } else if (difficulty === 2) {
          libelle = "MOYEN"
          color = "ORANGE";
          sec = "20 secondes";
          time = 20000
        } else if (difficulty === 3) {
          libelle = "DIFFICILE"
          color = "RED";
          sec = "12 secondes";
          time = 12000
        } else if (difficulty === 4) {
          libelle = "EXTREME"
          color = "DARK_BUT_NOT_BLACK";
          sec = "10 secondes";
          time = 10000;
        }

        const embed = new MessageEmbed()
          .setColor(color)
          .setAuthor(`Difficulté : ${libelle}`)
          .setTitle("Devinez le joueur en fonction des clubs par lequel il est passé")
          .setDescription(`Vous avez ${sec}`)
          .setImage(`attachment://${id}.png`);

        const filter = (m) => nomJoueur.includes(m.content.toLowerCase())

        guild.channels.cache.get(process.env.EVENT).send({
          embeds: [embed],
          files: [img]
      })
        interaction.reply({
            content: "Qui est ce joueur ?",
            ephemeral: true
          })
          .then(() => {
            interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: time
              })
              .then(collected => {
                const winner = collected.first().author.id
                interaction.followUp(`Félicitations <@${winner}> ! `)
              })
              .catch(collected => {
                interaction.followUp(`Personne n'a trouvé la solution dans le temps imparti. La bonne réponse était : ${value}`)
              })
          })
      } else {
        interaction.reply({
          content: "Le joueur demandé n'existe pas",
          ephemeral: true
        })
      }
    }
  }
}