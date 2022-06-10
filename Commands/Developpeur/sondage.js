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
      name: 'equipe',
      description: "equipe du transfert",
      type: "STRING",
      required: true
    },
    {
      name: 'timing',
      description: "Durée de récupération des réponses",
      type: "NUMBER",
      required: true
    },
    {
      name: 'salon',
      description: "Salon où envoye le message",
      type: "CHANNEL",
      required: true
  },
  ],

  execute(interaction, client) {

    const equipe = interaction.options.getString("equipe");
    const timing = interaction.options.getNumber("timing");
    const loggingChannel = interaction.options.getChannel("salon").id;

    const reponses = [];
    const counts = {};

    const canvas = new ChartJSNodeCanvas({
      width: 800,
      height: 600,
      backgroundColour: 'white'
    })

    client.channels.cache.get(loggingChannel).send({
      content: `Sondage lancé : Quel serait pour vous la recrue idéale pour : ${equipe} ?`
    })

    const filter = m => !m.content.includes('Sondage');

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
      reponses.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });
      const keysChart = Object.keys(counts);
      const valueChart = Object.values(counts);

      const configuration = {
        type: "bar",
        data: {
          labels: keysChart,
          datasets: [{
            label: `Votre meilleure recrue pour : ${equipe}`,
            data: valueChart,
            backgroundColor: '#14171f',
          }]
        }
      }

      const image = await canvas.renderToBuffer(configuration)

      const attachement = new MessageAttachment(image)

      client.channels.cache.get(loggingChannel).send({
        files: [attachement]
      })
    });


  }
}