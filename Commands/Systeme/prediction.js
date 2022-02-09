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
					{
						name: "Medaille (seulement JO)",
						value: "medaille"
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
				require: false,
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

	async execute(interaction, client) {
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
								.setDescription(`Est-ce que ${buteur} sera buteur lors de ${match} ?`)
								.setFooter(buteur)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il sera buteur \n ${process.env.TWO} : Si vous pensez qu'il ne sera pas buteur`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [buteurEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "final": {
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const matchEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Score final")
								.setTitle(`${match}`)
								.setDescription("Laquelle de ces 2 équipes gagnera le match ?")
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n 3 \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [matchEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "but": {
							const buts = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const butsEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Buts")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous qu'il y aura ${buts} buts dans ce match ?`)
								.setFooter(buts)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il y aura + \n ${process.env.TWO} : Si vous pensez que qu'il y aura -`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [butsEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "medaille": {
							const nbMedaille = options.getString("valeur")
							const match = `${options.getString("team1")}`
							const butsEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Medailles")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous que la ${match} aura plus de ${nbMedaille} médailles durant ces JO ?`)
								.setFooter(nbMedaille)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il y aura + \n ${process.env.TWO} : Si vous pensez que qu'il y aura -`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [butsEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "score45": {
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const matchEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Score -45")
								.setTitle(`${match}`)
								.setDescription("Laquelle de ces 2 équipes gagnera le match à la mi-temps ?")
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n 3 \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [matchEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "score90": {
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const matchEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Score +45")
								.setTitle(`${match}`)
								.setDescription("Laquelle de ces 2 équipes gagnera le match en seconde période ?")
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n 3 \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [matchEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
						case "cartons": {
							const cartons = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const cartonEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Cartons")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous qu'il y aura ${cartons} cartons dans ce match`)
								.setFooter(cartons)
								.addFields({
									name: 'Prono 1',
									value: `${process.env.ONE} : Si vous pensez qu'il y en aura + \n ${process.env.TWO} : Si vous pensez qu'il y en aura -'`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [cartonEmbed]
							})
							const message = await interaction.fetchReply();
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
							break;
						}
					}
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