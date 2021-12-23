const {
	ContextMenuInteraction,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu
} = require("discord.js");

const fetchAll = require('discord-fetch-all');

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
		//const team1 = msg.embeds[0].title.split("-")[0]
		//const team2 = msg.embeds[0].title.split("-")[1]
		let teamWin = "";

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
				.setCustomId('predictChoice')
				.setPlaceholder('Choisissez le gagnant')
				.addOptions([{
						label: `Test`,
						description: `Choisissez cette option si Test a gagné`,
						value: `1`,
					},
					{
						label: `Match nul`,
						description: `Choisissez cette option s'il y a eu match nul`,
						value: `x`,
					},
					{
						label: `Test2`,
						description: `Choisissez cette option si Test2 a gagné`,
						value: `2`,
					},
				]),
			);

		const filter = (interact) =>
			interact.isSelectMenu();

		const collector = msg.channel.createMessageComponentCollector({
			filter,
			max: "2",
		});

		collector.on('collect', async (collected) => {
			console.log(msg.reactions);
			teamWin = collected.values[0];
			console.log(teamWin)

			if (teamWin == 1) {
				const allMessages = await fetchAll.reactions(msg, {
					userOnly: true, // Only return users that have reacted to the message
					botOnly: false, // Only return bots that have reacted to the message
				});
				console.log(allMessages);
			}

		})

		interaction.reply({
			content: 'Choisissez le gagnant :',
			components: [row],
			ephemeral: true
		})
	}
}