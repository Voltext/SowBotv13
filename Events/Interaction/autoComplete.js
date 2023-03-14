const Discord = require("discord.js");
const LDLMPlayer = require('../../Schemas/mysql/LDLMPlayer')

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isAutocomplete()) {
      let entry = interaction.options.getFocused()
      const playersData = await LDLMPlayer.getAllPlayers()
      if (typeof playersData[0] !== 'undefined') {
        const propertyNames = Object.keys(playersData);

        console.log(propertyNames);

        const filtered = playersData.filter(choice => choice.Surname.startsWith(entry));
        await interaction.respond(
          filtered.map(choice => ({
            name: choice,
            value: choice
          })),
        );
      }
    }
  }
}