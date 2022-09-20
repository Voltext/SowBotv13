const {
  CommandInteraction,
  Client,
  MessageEmbed
} = require('discord.js');
const mongo = require('../../mongo');
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
      name: "list",
      description: "Accede a la liste des mts interdits",
      type: "SUB_COMMAND",
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
          required: false,
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

        mongo().then(async (mongoosesettings) => {
          try {
            await Schema.findOneAndUpdate({
              Guild: guild.id
            }, {
              Log: loggingChannel
            }, {
              new: true,
              upsert: true
            });
          } catch {
            console.log("Erreur commande chatfilter: chatfilter(87)")
            mongoosesettings.connection.close()
          }
        })

        client.filtersLog.set(guild.id, loggingChannel);

        interaction.reply({
          content: `Le salon <#${loggingChannel}> a bien été designé comme salon accueillant les logs des mots interdits`,
          ephemeral: true
        });
        break;
      case "list":
        let listWord = "";
        client.filters.get(guild.id).map((w) => {
          listWord = listWord + w + ", ";
        });

        const embedWord = new MessageEmbed()
          .setTitle("Voici la liste des mots interdits")
          .setDescription(`\`\`\`${listWord}\`\`\``);

        return interaction.reply({
          content: "Voici la la liste des mots interdits",
          embeds: [embedWord],
          ephemeral: true
        })
        break;
      case "configure":
        const Choice = options.getString("options");
        const Words = options.getString("word").toLowerCase().split(",");

        switch (Choice) {
          case "add":
            mongo().then(async (mongoosechat) => {
              try {
                await Schema.findOne({
                  Guild: guild.id
                }, async (err, data) => {
                  if (err) throw err;
                  if (!data) {
                    Schema.create({
                      Guild: guild.id,
                      Log: null,
                      Words: Words,
                    });

                    client.filters.set(guild.id, Words);

                    return interaction.reply({
                      content: `${Words.length} mot(s) a(ont) ete ajouté à la liste`,
                      ephemeral: true
                    });
                  }

                  const newWords = [];

                  Words.forEach((w) => {
                    if (data.Words.includes(w)) return;
                    newWords.push(w);
                    data.Words.push(w);
                    client.filters.get(guild.id).push(w);
                  });

                  data.save();

                  return interaction.reply({
                    content: `${newWords.length} mot(s) a(ont) ete ajouté à la liste`,
                    ephemeral: true
                  });
                });
              } catch {
                console.log("Erreur commande chatfilter: chatfilter(160)")
                mongoosechat.connection.close()
              }
            })
            break;
          case "remove":
            await mongo().then(async (mongoosechatr) => {
              try {
                await Schema.findOne({
                  Guild: guild.id
                }, async (err, data) => {
                  if (err) throw err;
                  if (!data) {
                    return interaction.reply({
                      content: "Aucune donnée n'est disponible. Suppression impossible",
                      ephemeral: true
                    });
                  }

                  const removeWords = [];

                  Words.forEach((w) => {
                    if (!data.Words.includes(w)) return;
                    data.Words.push(w);
                    removeWords.push(w);
                  });

                  const newArray = await client.filters
                    .get(guild.id)
                    .filter((word) => !removeWords.includes(word));

                  client.filters.set(guild.id, newArray);

                  interaction.reply({
                    content: `${removeWords.length} mot(s) a(ont) ete supprimés à la liste`,
                    ephemeral: true
                  })

                  data.save();
                });
              } catch {
                console.log("Erreur commande chatfilter: chatfilter(201)")
                mongoosechatr.connection.close()
              }
            })
            break;
        }
        break;
    }
  }
};