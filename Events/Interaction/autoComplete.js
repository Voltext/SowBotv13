const Discord = require("discord.js");
const LDLMPlayer = require('../../Schemas/mysql/LDLMPlayer')

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isAutocomplete()) {
      let entry = interaction.options.getFocused()
      const playersData = await LDLMPlayer.getAllPlayers()

        const propertyNames = Object.values(playersData);

        const filtered = propertyNames.filter(choice => choice.Surname.startsWith(entry));
        await interaction.respond(
          filtered.map(choice => ({
            name: choice.Surname.substr(0,24),
            value: choice.Surname.substr(0,24)
          })),
        );
    }
  }
}