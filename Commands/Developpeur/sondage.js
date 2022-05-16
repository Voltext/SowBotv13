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
    {
      name: 'regex',
      description: "Potentielle regex a respecter",
      type: "STRING",
      required: false
    },
  ],

  execute(interaction) {

    const libelle = interaction.options.getString("libelle");
    const timing = interaction.options.getNumber("timing");
    const regexPatern = interaction.options.getString("regex");

    const canvas = new ChartJSNodeCanvas({width: 800, height: 600, backgroundColour: 'white'})

    if (regexPatern) {
      const filter = m => Utils.validRegex(regexPatern, m.content) === true

      const collector = interaction.channel.createMessageCollector({
        filter,
        time: timing
      });

      collector.on('collect', m => {
        console.log(`Collected ${m.content}`);
      });

      collector.on('end', async collected => {
        console.log(collected)
        const configuration = {
          type: "doughnut",
          data: {
            labels: [1,2,3],
            datasets: [{ label: "Scores", data: [4,5,6] }]
          }
        }

        const image = await canvas.renderToBuffer(configuration)

        const attachement = new MessageAttachment(image)

        interaction.reply({
          files: [attachement]
        })
      });
    }

    
  }
}