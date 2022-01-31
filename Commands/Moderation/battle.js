const {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu
} = require("discord.js");
const ms = require("ms");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
  name: "battle",
  description: "Permet de créer une battle",
  permission: "KICK_MEMBERS",
  options: [{
      name: "create",
      description: "Creer une battle",
      type: "SUB_COMMAND",
      options: [{
        name: "joueur1",
        description: "Saisissez @ du joueur 1",
        type: "STRING",
        require: true,
      }, {
        name: "joueur2",
        description: "Saisissez @ du joueur 2",
        type: "STRING",
        require: true,
      }, ],
    },
    {
      name: "list",
      description: "Acceder à la liste des battle",
      type: "SUB_COMMAND",
    },
    {
      name: "remove",
      description: "Supprimer une battle",
      type: "SUB_COMMAND",
      options: [{
        name: "bid",
        description: "Saisissez l'identifiant de la battle a supprimer",
        type: "STRING",
        require: true,
      }, ],
    },
    {
      name: "newprono",
      description: "Ajouter un prono a une battle",
      type: "SUB_COMMAND",
      options: [
        {
          name: "idbattle",
          description: "Saisissez l'identifiant de la battle reliee a ce prono",
          type: "STRING",
          require: true,
        },{
          name: "type",
          description: "Le type de prédiction que vous souhaitez créer",
          type: "STRING",
          require: true,
          choices: [
            {
              name: "Résultat final",
              value: "final"
            },
            {
              name: "+/- de buts",
              value: "but"
            },
            {
              name: "Cartons",
              value: "cartons"
            },
            {
              name: "Score -45min",
              value: "score45"
            },
            {
              name: "Score 45+",
              value: "score90"
            },
            {
              name: "Buteur",
              value: "buteur"
            },
          ],
        },
        {
          name: "team1",
          description: "Saisissez la première équipe qui joue à domicile",
          type: "STRING",
          require: true,
        }, {
          name: "team2",
          description: "Saisissez la deuxième équipe qui joue à l'extérieur",
          type: "STRING",
          require: true,
        }, {
          name: "cote1",
          description: "La côte pour le premier choix",
          type: "STRING",
          require: true,
        },
        {
          name: "cote2",
          description: "La côte pour le deuxième choix",
          type: "STRING",
          require: true,
        },
        {
          name: "valeur",
          description: "Valeur a renseignée pour les pronos : Buteur / +- Buts / Cartons",
          type: "STRING",
          require: false,
        },
      ],
    },
  ],

  execute(interaction, client) {

  }
}