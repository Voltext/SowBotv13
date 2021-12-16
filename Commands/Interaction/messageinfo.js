const { ContextMenuInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");

module.exports = {
    name: "minfo",
    type: "MESSAGE",
    permission: "KICK_MEMBERS",

    /**
     * 
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const msg = await interaction.channel.messages.fetch(interaction.targetId);
        const team1 = msg.embeds[0].title.split("-")[0]
        const team2 = msg.embeds[0].title.split("-")[1] 

        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('predictChoice')
					.setPlaceholder('Choisissez le gagnant')
					.addOptions([
						{
							label: `${team1}`,
							description: `Choisissez cette option si ${team1} a gagné`,
							value: `${team1}`,
						},
						{
							label: `${team2}`,
							description: `Choisissez cette option si ${team2} a gagné`,
							value: `${team2}`,
						},
					]),
      );

      interaction.reply({content: 'Choisissez le gagnant :', components: [row], ephemeral: true})
    }
}
