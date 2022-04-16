const {
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
require('dotenv').config();
const DIG = require("discord-image-generation");

module.exports = {
  name: "troll",
  description: "Set la prog de la semaine",
  permission: "ADMINISTRATOR",
  options: [{
    name: "new",
    description: "Créer un troll",
    type: "SUB_COMMAND",
    options: [{
        name: "type",
        description: "Le type de prédiction que vous souhaitez créer",
        type: "STRING",
        require: true,
        choices: [{
            name: "Giffle",
            value: "slap"
          },
          {
            name: "Delete",
            value: "delete"
          },
          {
            name: "Poubelle",
            value: "trash"
          },
          {
            name: "Facepalm",
            value: "facepalm"
          },
          {
            name: "Stonks",
            value: "stonks"
          },
          {
            name: "Trigger",
            value: "trigger"
          },
          {
            name: "Confuse",
            value: "confuse"
          },
          {
            name: "Jail",
            value: "jail"
          },
          {
            name: "Podium",
            value: "podium"
          },
          {
            name: "Beautiful",
            value: "beautiful"
          },
        ]
      },
      {
        name: "user1",
        description: "Saisissez l'utilisateur 1",
        type: "USER",
        require: true,
      },
      {
        name: "channel",
        description: "Saisissez le salon",
        type: "CHANNEL",
        require: true,
      },
      {
        name: "user2",
        description: "Saisissez l'utilisateur 2",
        type: "USER",
        require: false,
      },
      {
        name: "user3",
        description: "Saisissez l'utilisateur 3",
        type: "USER",
        require: false,
      }
    ]
  }],

  async execute(interaction) {
    const {
      options,
      member,
      guild,
      channel
    } = interaction;
    switch (options.getSubcommand()) {
      case "new": {
        switch (options.getString("type")) {
          case "slap": {
            const user1 = options.getMember("user1")
            const user2 = options.getMember("user2")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            let avatarTwo = user2.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Batslap().getImage(avatarOne, avatarTwo)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "delete": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Delete().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "podium": {
            const user1 = options.getMember("user1")
            const user2 = options.getMember("user2")
            const user3 = options.getMember("user3")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            let avatarTwo = user2.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            let avatarThree = user3.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Podium().getImage(avatarOne, avatarTwo, avatarThree, user1.user.username, user2.user.username, user3.user.username)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "stonks": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Stonk().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "trash": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Trash().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "beautiful": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Beautiful().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "jail": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Jail().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "confuse": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.ConfusedStonk().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "trigger": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Triggered().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
          case "facepalm": {
            const user1 = options.getMember("user1")

            let avatarOne = user1.user.displayAvatarURL({
              dynamic: false,
              format: 'png'
            });
            // Make the image
            let img = await new DIG.Facepalm().getImage(avatarOne)
            // Add the image as an attachement
            let attach = new MessageAttachment(img, "delete.png");;
            const loggingChannel = interaction.options.getChannel("channel").id;
            guild.channels.cache.get(loggingChannel).send({
              files: [attach]
            })
            break;
          }
        }
      }
    }
  }
}