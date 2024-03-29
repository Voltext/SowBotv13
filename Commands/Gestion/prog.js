const { MessageEmbed } = require("discord.js");
const TwitchSchedule = require("../../Api/twitchschedule");
require('dotenv').config();
const Moment = require("moment");

module.exports = {
  name: "prog",
  description: "Set la prog de la semaine",
  permission: "ADMINISTRATOR",

  async execute(interaction) {
    Moment.locale("fr");
    const getSchedule = new TwitchSchedule();

    const prog = await getSchedule.Schedule()
    if (prog.data.segments !== null) {
      const programmation = prog.data.segments;
      const embed = new MessageEmbed()
        .setTitle("Programme de la semaine")
        .setColor("PURPLE")
        .setDescription("Voici le programme prévu pour la semaine")
        .setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
        .setURL("http://twitch.tv/sowdred");
      programmation.forEach(function (elem) {
        const date = Moment(elem.start_time).format('DD-MM-YYYY HH:MM')
        embed.addFields({
          name: "Date début",
          value: `${date}`,
          inline: true,
        }, {
          name: "Titre",
          value: `${elem.title}`,
          inline: true,
        }, {
          name: "Catégorie",
          value: `${elem.category.name}`,
          inline: true,
        });
      })
      interaction.reply({
        content: "Voici le planning de la semaine ! ",
        embeds: [embed]
      })
    } else {
      const embed = new MessageEmbed()
        .setTitle("Programme de la semaine")
        .setColor("PURPLE")
        .setDescription("Voici le programme prévu pour la semaine")
        .setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
        .setURL("http://twitch.tv/sowdred")
        .addField("Programme introuvable", "Le programme n'a pas encore été défini");

      interaction.reply({
        content: "Voici le planning de la semaine ! ",
        embeds: [embed]
      })
    }
  }
}