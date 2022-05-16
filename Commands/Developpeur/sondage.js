const {
  CommandInteraction,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const Chart = require('chart.js');
const {
  ChartJSNodeCanvas
} = require("chartjs-node-canvas");
const Utils = require("../../Utils/function")

module.exports = {
  name: "sondage",
  description: "Lancer un sondage",
  permission: "ADMINISTRATOR",
  options: [{
      name: 'libelle',
      description: "Libelle du sondage",
      type: "STRING",
      required: true
    },
    {
      name: 'timing',
      description: "Durée de récupération des réponses",
      type: "NUMBER",
      required: true
    },
  ],

  execute(interaction, client) {

    const libelle = interaction.options.getString("libelle");
    const timing = interaction.options.getNumber("timing");
    
    const reponses = [];
    const counts = {};

    const canvas = new ChartJSNodeCanvas({
      width: 800,
      height: 600,
      backgroundColour: 'white'
    })

    const filter = m => Utils.validScoreRegex(m.content) === true

    const collector = interaction.channel.createMessageCollector({
      filter,
      time: timing
    });

    collector.on('collect', m => {
      console.log(`Collected ${m.content}`);
    });

    collector.on('end', async collected => {
      collected.map((score) => {
        reponses.push(score.content);
      })
      reponses.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      console.log(counts)
      const configuration = {
        type: "bar",
        data: {
          labels: [1, 2, 3],
          datasets: [{
            label: "Scores",
            data: [4, 5, 6],
            backgroundColor: 'red',
          }]
        }
      }

      const image = await canvas.renderToBuffer(configuration)

      const attachement = new MessageAttachment(image)

      client.channels.cache.get("796022491688337408").send({
        files: [attachement]
      })
    });


  }
}