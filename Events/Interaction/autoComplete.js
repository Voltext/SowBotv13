const Discord = require("discord.js");
const LDLMPlayer = require('../../Schemas/mysql/LDLMPlayer')

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isAutocomplete()) {
      let entry = interaction.options.getFocused()
      const playersData = await LDLMPlayer.getAllPlayers()

        const propertyNames = Object.entries(playersData);
        console.log(propertyNames)

        const filtered = propertyNames.filter(choice => console.log);
        await interaction.respond(
          filtered.map(choice => ({
            name: choice,
            value: choice
          })),
        );
    }
  }
}