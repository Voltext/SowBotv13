const {
  CommandInteraction,
  MessageEmbed
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

    const canvas = new ChartJSNodeCanvas(800, 600, white)

    if (regexPatern) {
      const filter = m => Utils.validRegex(regexPatern, m.content) === true

      const collector = interaction.channel.createMessageCollector({
        filter,
        time: timing
      });

      collector.on('collect', m => {
        console.log(`Collected ${m.content}`);
      });

      collector.on('end', collected => {
        console.log(collected)
        const myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [
              'Red',
              'Blue',
              'Yellow'
            ],
            datasets: [{
              label: 'My First Dataset',
              data: [300, 50, 100],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          }
        });
      });
    }

    
  }
}