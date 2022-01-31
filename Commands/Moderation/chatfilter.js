const {
  CommandInteraction,
  Client
} = require('discord.js');
const Schema = require("../../Schemas/filterSchema");

module.exports = {
  name: "filtre",
  description: "Un systeme de filtre de messages",
  permission: "MANAGE_MESSAGES",
  options: [{
      name: "settings",
      description: "Parametrage du systeme",
      type: "SUB_COMMAND",
      options: [{
        name: "logging",
        description: "Permet de setup un channel qui recevra les logs",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
        required: true,
      }, ],
    },
    {
      name: "configure",
      description: "Ajouter ou supprimer des mots interdits",
      type: "SUB_COMMAND",
      options: [{
          name: "options",
          description: "Choisissez une option...",
          type: "STRING",
          required: true,
          choices: [{
              name: "Ajouter",
              value: "add"
            },
            {
              name: "Supprimer",
              value: "remove"
            },
          ],
        },
        {
          name: "word",
          description: "Saisissez le mot interdit",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],

  /**
   * 
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const {
      guild,
      options
    } = interaction

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "settings":
        const loggingChannel = options.getChannel("logging").id;

        await Schema.findOneAndUpdate({
          Guild: guild.id
        }, {
          Log: loggingChannel
        }, {
          new: true,
          upsert: true
        });

        client.filtersLog.set(guild.id, loggingChannel);

        interaction.reply({
          content: `Le salon <#${loggingChannel}> a bien été designé comme salon accueillant les logs des mots interdits`,
          ephemeral: true
        })
        break;
      case "configure":
        const Choice = options.getString("options");
        const Words = options.getString("word").toLowerCase();

        switch (Choice) {
          case "add":
            Schema.findOne({
              Guild: guild.id
            }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                await Schema.create({
                  Guild: guild.id,
                  Log: null,
                  Words: Words,
                });

                client.filters.set(guild.id, Words);

                return interaction.reply({
                  content: `${Words} a ete ajouté à la liste`,
                  ephemeral: true
                });
              }

              const newWords = [];

              console.log(client.filters);

              if (data.Words.includes(Words)) return;
              newWords.push(Words);
              data.Words.push(Words);
              client.filters.set(guild.id, Words);

              return interaction.reply({
                content: `${Words} a ete ajouté à la liste`,
                ephemeral: true
              });
              data.save();
            });
            break;
          case "remove":

            break;
        }
        break;
    }
  }
};