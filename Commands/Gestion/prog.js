const { CommandInteraction } = require("discord.js");
const TwitchSchedule = require("../../Api/twitchschedule");
require('dotenv').config();

module.exports = {
    name: "prog",
    description: "Set la prog de la semaine",
    permission: "ADMINISTRATOR",

    execute(interaction) {
      const getSchedule = new TwitchSchedule();
      schedule.scheduleJob('0 0 * * *', async () => {
  
        const programme = client.channels.cache.get(process.env.PROGRAMME);
        programme.bulkDelete(1);
  
        const prog = await getSchedule.Schedule()
        if (prog.data.segments !== null) {
          console.log(prog.data)
          const programmation = prog.data.segments;
          const embed = new MessageEmbed()
            .setTitle("Programme de la semaine")
            .setColor("PURPLE")
            .setDescription("Voici le programme prévu pour la semaine")
            .setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
            .setURL("http://twitch.tv/sowdred");
          programmation.forEach(function (elem) {
            const date = elem.start_time.split("T")[0];
            const heure = elem.start_time.split("T")[1];
            embed.addFields({
              name: "Date début",
              value: `${date} ${heure}`,
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
          client.channels.cache.get(process.env.PROGRAMME).send({
            content: "Voici le programme de la semaine",
            embeds: [embed],
          });
        } else {
          const embed = new MessageEmbed()
            .setTitle("Programme de la semaine")
            .setColor("PURPLE")
            .setDescription("Voici le programme prévu pour la semaine")
            .setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
            .setURL("http://twitch.tv/sowdred")
            .addField("Programme introuvable", "Le programme n'a pas encore été défini");
  
          client.channels.cache.get(process.env.PROGRAMME).send({
            content: "Voici le programme de la semaine",
            embeds: [embed],
          });
        }
      })
    }
}