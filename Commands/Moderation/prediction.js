const {
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu
} = require("discord.js");
const ms = require("ms");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
	name: "prediction",
	description: "Permet de créer une prédiction",
	permission: "KICK_MEMBERS",
	options: [{
		name: "new",
		description: "Créer une prédiction",
		type: "SUB_COMMAND",
		options: [{
				name: "type",
				description: "Le type de prédiction que vous souhaitez créer",
				type: "STRING",
				require: true,
				choices: [{
						name: "Résultat final",
						value: "final"
					},
					{
						name: "+/- de buts",
						value: "but"
					},
					{
						name: "Cartons",
						value: "cartons"
					},
					{
						name: "Score -45min",
						value: "score45"
					},
					{
						name: "Score 45+",
						value: "score90"
					},
					{
						name: "Buteur",
						value: "buteur"
					},
				]
			},
			{
				name: "team1",
				description: "Saisissez la première équipe qui joue à domicile",
				type: "STRING",
				require: true,
			}, {
				name: "team2",
				description: "Saisissez la deuxième équipe qui joue à l'extérieur",
				type: "STRING",
				require: true,
			}, {
				name: "cote1",
				description: "La côte pour le premier choix",
				type: "STRING",
				require: true,
			},
			{
				name: "cote2",
				description: "La côte pour le deuxième choix",
				type: "STRING",
				require: true,
			},
			{
				name: "valeur",
				description: "Valeur a renseignée pour les pronos : Buteur / +- Buts / Cartons",
				type: "STRING",
				require: false,
			},
		]
	}],

	execute(interaction, client) {
		const {
			options,
			member,
			guild,
			channel
		} = interaction;

		try {
			switch (options.getSubcommand()) {
				case "new": {
					switch (options.getString("type")) {
						case "buteur": {
							const buteur = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const buteurEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Buteur")
								.setTitle(`${match}`)
								.setDescription(`Est-ce que ${buteur} sera buteur lors de ce match ?`)
								.setFooter(buteur)
								.addFields({
									name: 'Prono 1',
									value: `${process.env.ONE} : Si vous pensez qu'il sera buteur`,
									inline: true
								}, {
									name: 'Prono 2',
									value: `${process.env.TWO} : Si vous pensez qu'il ne sera pas buteur`,
									inline: true
								}, )
								.addFields({
									name: 'Côte prono 1',
									value: `${options.getString("cote1")}`,
									inline: true
								}, {
									name: 'Côte prono 2',
									value: `${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [buteurEmbed]
							})
							const message = interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoose) => {
								try {
									await prediSchema.findOneAndUpdate({
										msgId,
									}, {
										msgId,
										status,
									}, {
										upsert: true,
									})
								} finally {
									mongoose.connection.close()
								}
							})
						}
					}
					break;
				}
				case "final": {
					let filter = (m) => m.author.id === interaction.user.id;
					interaction.reply({
							content: "Saisissez le match que vous souhaitez en séparant les équipe par un `-`",
							ephemeral: true
						})
						.then(() => {
							interaction.channel.awaitMessages({
									filter,
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(collected => {
									const match = collected.first().content;
									const team1 = match.split("-")[0]
									const team2 = match.split("-")[1]
									const matchEmbed = new MessageEmbed()
										.setColor("AQUA")
										.setAuthor("Score final")
										.setTitle(`${match}`)
										.setDescription("Laquelle de ces 2 équipes gagnera le match ?")
										.setFooter(match)
										.addFields({
											name: 'Prono 1',
											value: `${process.env.ONE} : Si vous pensez que ${team1} va gagner`,
											inline: true
										}, {
											name: 'Prono 2',
											value: `${process.env.CROSS_ID} : Si vous pensez que qu'il y aura match nul`,
											inline: true
										}, {
											name: 'Prono 3',
											value: `${process.env.TWO} : Si vous pensez que ${team2} va gagner`,
											inline: true
										}, );
									collected.first().delete()
									interaction.followUp({
										embeds: [matchEmbed]
									}).then(message => {
										message.react(process.env.ONE)
										message.react(process.env.CROSS_ID)
										message.react(process.env.TWO)
										const status = "open";
										const msgId = message.id;
										mongo().then(async (mongoose) => {
											try {
												await prediSchema.findOneAndUpdate({
													msgId,
												}, {
													msgId,
													status,
												}, {
													upsert: true,
												})
											} finally {
												mongoose.connection.close()
											}
										})
									})
								})
								.catch(collected => {
									interaction.followUp({
										content: "Vous n'avez pas saisi de réponse dans le temps imparti, merci de réitérer la commande",
										ephemeral: true
									});
								});
						});
					break;
				}
				case "but": {
					let filter = (m) => m.author.id === interaction.user.id;
					interaction.reply({
							content: "Saisissez le match en séparant les 2 équipes par un `-`. Puis saisissez un nombre de but total qu'il y aura dans le match (Détails : +3.5 ou -3.5) séparé par un `/`",
							ephemeral: true
						})
						.then(() => {
							interaction.channel.awaitMessages({
									filter,
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(collected => {
									const data = collected.first().content;
									const buts = data.split("/")[1]
									const match = data.split("/")[0]
									const butsEmbed = new MessageEmbed()
										.setColor("AQUA")
										.setAuthor("Buts")
										.setTitle(`${match}`)
										.setDescription(`Pensez-vous qu'il y aura ${buts} buts dans ce match ?`)
										.setFooter(buts)
										.addFields({
											name: 'Prono 1',
											value: `${process.env.ONE} : Si vous pensez qu'il y aura +`,
											inline: true
										}, {
											name: 'Prono 2',
											value: `${process.env.TWO} : Si vous pensez que qu'il y aura -`,
											inline: true
										}, );
									collected.first().delete()
									interaction.followUp({
										embeds: [butsEmbed]
									}).then(message => {
										message.react(process.env.ONE)
										message.react(process.env.TWO)
										const status = "open";
										const msgId = message.id;
										mongo().then(async (mongoose) => {
											try {
												await prediSchema.findOneAndUpdate({
													msgId,
												}, {
													msgId,
													status,
												}, {
													upsert: true,
												})
											} finally {
												mongoose.connection.close()
											}
										})
									})
								})
								.catch(collected => {
									interaction.followUp({
										content: "Vous n'avez pas saisi de réponse dans le temps imparti, merci de réitérer la commande",
										ephemeral: true
									});
								});
						});
					break;
				}
				case "score45": {
					let filter = (m) => m.author.id === interaction.user.id;
					interaction.reply({
							content: "Saisissez le match que vous souhaitez en séparant les équipe par un `-`",
							ephemeral: true
						})
						.then(() => {
							interaction.channel.awaitMessages({
									filter,
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(collected => {
									const match = collected.first().content;
									const team1 = match.split("-")[0]
									const team2 = match.split("-")[1]
									const matchEmbed = new MessageEmbed()
										.setColor("AQUA")
										.setAuthor("Score -45")
										.setTitle(`${match}`)
										.setDescription("Laquelle de ces 2 équipes gagnera le match à la mi-temps ?")
										.setFooter(match)
										.addFields({
											name: 'Prono 1',
											value: `${process.env.ONE} : Si vous pensez que ${team1} va gagner`,
											inline: true
										}, {
											name: 'Prono 2',
											value: `${process.env.CROSS_ID} : Si vous pensez que qu'il y aura match nul`,
											inline: true
										}, {
											name: 'Prono 3',
											value: `${process.env.TWO} : Si vous pensez que ${team2} va gagner`,
											inline: true
										}, );
									collected.first().delete()
									interaction.followUp({
										embeds: [matchEmbed]
									}).then(message => {
										message.react(process.env.ONE)
										message.react(process.env.CROSS_ID)
										message.react(process.env.TWO)
										const status = "open";
										const msgId = message.id;
										mongo().then(async (mongoose) => {
											try {
												await prediSchema.findOneAndUpdate({
													msgId,
												}, {
													msgId,
													status,
												}, {
													upsert: true,
												})
											} finally {
												mongoose.connection.close()
											}
										})
									})
								})
								.catch(collected => {
									interaction.followUp({
										content: "Vous n'avez pas saisi de réponse dans le temps imparti, merci de réitérer la commande",
										ephemeral: true
									});
								});
						});
					break;
				}
				case "score90": {
					let filter = (m) => m.author.id === interaction.user.id;
					interaction.reply({
							content: "Saisissez le match que vous souhaitez en séparant les équipe par un `-`",
							ephemeral: true
						})
						.then(() => {
							interaction.channel.awaitMessages({
									filter,
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(collected => {
									const match = collected.first().content;
									const team1 = match.split("-")[0]
									const team2 = match.split("-")[1]
									const matchEmbed = new MessageEmbed()
										.setColor("AQUA")
										.setAuthor("Score +45")
										.setTitle(`${match}`)
										.setDescription("Laquelle de ces 2 équipes gagnera le match en seconde période ?")
										.setFooter(match)
										.addFields({
											name: 'Prono 1',
											value: `${process.env.ONE} : Si vous pensez que ${team1} va gagner`,
											inline: true
										}, {
											name: 'Prono 2',
											value: `${process.env.CROSS_ID} : Si vous pensez que qu'il y aura match nul`,
											inline: true
										}, {
											name: 'Prono 3',
											value: `${process.env.TWO} : Si vous pensez que ${team2} va gagner`,
											inline: true
										}, );
									collected.first().delete()
									interaction.followUp({
										embeds: [matchEmbed]
									}).then(message => {
										message.react(process.env.ONE)
										message.react(process.env.CROSS_ID)
										message.react(process.env.TWO)
										const status = "open";
										const msgId = message.id;
										mongo().then(async (mongoose) => {
											try {
												await prediSchema.findOneAndUpdate({
													msgId,
												}, {
													msgId,
													status,
												}, {
													upsert: true,
												})
											} finally {
												mongoose.connection.close()
											}
										})
									})
								})
								.catch(collected => {
									interaction.followUp({
										content: "Vous n'avez pas saisi de réponse dans le temps imparti, merci de réitérer la commande",
										ephemeral: true
									});
								});
						});
					break;
				}
				case "cartons": {
					let filter = (m) => m.author.id === interaction.user.id;
					interaction.reply({
							content: "Saisissez un nombre de cartons pour la prédiction (Un nombre décimal : Ex : +16.5)",
							ephemeral: true
						})
						.then(() => {
							interaction.channel.awaitMessages({
									filter,
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(collected => {
									const data = collected.first().content;
									const cartons = data.split("/")[1]
									const match = data.split("/")[0]
									const cartonEmbed = new MessageEmbed()
										.setColor("AQUA")
										.setAuthor("Cartons")
										.setTitle(`${match}`)
										.setDescription(`Pensez-vous qu'il y aura ${cartons} cartons dans ce match`)
										.setFooter(cartons)
										.addFields({
											name: 'Prono 1',
											value: `${process.env.ONE} : Si vous pensez qu'il y en aura +`,
											inline: true
										}, {
											name: 'Prono 2',
											value: `${process.env.TWO} : Si vous pensez qu'il y en aura -'`,
											inline: true
										}, );
									collected.first().delete()
									interaction.followUp({
										embeds: [cartonEmbed]
									}).then(message => {
										message.react(process.env.ONE)
										message.react(process.env.TWO)
										const status = "open";
										const msgId = message.id;
										mongo().then(async (mongoose) => {
											try {
												await prediSchema.findOneAndUpdate({
													msgId,
												}, {
													msgId,
													status,
												}, {
													upsert: true,
												})
											} finally {
												mongoose.connection.close()
											}
										})
									})
								})
								.catch(collected => {
									interaction.followUp({
										content: "Vous n'avez pas saisi de réponse dans le temps imparti, merci de réitérer la commande",
										ephemeral: true
									});
								});
						});
					break;
				}
			}
		} catch {
			interaction.reply({
				content: "La catégorie choisie n'existe pas ou n'est pas disponible",
				ephemeral: true
			});
		}
	}
}