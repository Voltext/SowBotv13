const { CommandInteraction, MessageEmbed } = require("discord.js");

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
                  name: "isTeam",
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
        
    const subCommand = options.getSubcommand();

    switch(subCommand) {
      case "entrainement": {
        break;
      }
      case "match": {
        break;
      }
      case "createplayer": {
        break;
      }
    }

  }
}