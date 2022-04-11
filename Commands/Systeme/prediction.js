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
					{
						name: "Gagne la competition",
						value: "compet"
					},
					{
						name: "Equipes gagnent",
						value: "teams"
					},
					{
						name: "Score multiple",
						value: "scorem"
					},
					{
						name: "Gagne par ecart",
						value: "ecart"
					},
					{
						name: "Qualification",
						value: "qualif"
					},
					{
						name: "Double buteurs",
						value: "buteurs"
					},
					{
						name: "But avant",
						value: "butavant"
					},
					{
						name: "Buteur et Vainqueur",
						value: "butwin"
					},
					{
						name: "But journée",
						value: "butday"
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
			{
				name: "valeur2",
				description: "Valeur a renseignée pour les pronos : Gagne par ecart",
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
							mongo().then(async (mongoosebuteur) => {
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
									mongoosebuteur.connection.close()
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
							mongo().then(async (mongoosefinal) => {
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
									mongoosefinal.connection.close()
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
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
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
							mongo().then(async (mongoosemedaille) => {
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
									mongoosemedaille.connection.close()
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
							mongo().then(async (mongoose45) => {
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
									mongoose45.connection.close()
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
							mongo().then(async (mongoose90) => {
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
									mongoose90.connection.close()
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
							mongo().then(async (mongoosecarton) => {
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
									mongoosecarton.connection.close()
								}
							})
							break;
						}
						case "compet": {
							const team1 = options.getString("team1")
							const compet = options.getString("team2")
							const competEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Competition")
								.setTitle(`${team1} - ${compet}`)
								.setDescription(`Pensez-vous que ${team1} remportera ${compet} ?`)
								.setFooter(`${team1} gagnera ${compet}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'ils la gagneront + \n ${process.env.TWO} : Si vous pensez qu'ils ne la gagneront pas`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [competEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
								}
							})
							break;
						}
						case "teams": {
							const team1 = options.getString("team1")
							const team2 = options.getString("team2")
							const team3 = options.getString("valeur")
							let teamClone = ""
							if(team3 == null || team3 == "") {
								teamClone = `${team1} / ${team2}`
							}
							else {
								teamClone = `${team1} / ${team2} / ${team3}`
							}
							const teamsEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Equipes gagnent")
								.setTitle(`${teamClone}`)
								.setDescription(`Pensez-vous que ${teamClone} ne perdront pas (victoire ou nul) ?`)
								.setFooter(`${teamClone}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'ils ne perdront pas + \n ${process.env.TWO} : Si vous pensez qu'ils vont perdre`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [teamsEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
								}
							})
							break;
						}
						case "scorem": {
							const buts = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const butsmEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Buts Multiples")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous qu'il y aura ${buts} dans ce match ?`)
								.setFooter(buts)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [butsmEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
								}
							})
							break;
						}
						case "ecart": {
							const teamwin = options.getString("valeur")
							const ecart = options.getString("valeur2")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const ecartEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Gagne ecart")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous que ${teamwin} gagnera avec au moins ${ecart} buts d'écart ?`)
								.setFooter(`${teamwin} gagnera avec ${ecart}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [ecartEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
								}
							})
							break;
						}
						case "qualif": {
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const qualifEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Qualification")
								.setTitle(`${match}`)
								.setDescription("Laquelle de ces 2 équipes va se qualifier ?")
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va se qualifier \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va se qualifier`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [qualifEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosefinal) => {
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
									mongoosefinal.connection.close()
								}
							})
							break;
						}
						case "buteurs": {
							const buteurs = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const buteursEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Buteurs")
								.setTitle(`${match}`)
								.setDescription(`Est-ce qu'au moins l'un des 2 : ${buteurs} seront buteur lors de ${match} ?`)
								.setFooter(buteurs)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [buteursEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebuteur) => {
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
									mongoosebuteur.connection.close()
								}
							})
							break;
						}
						case "butavant": {
							const minute = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const minutesEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("But avant")
								.setTitle(`${match}`)
								.setDescription(`Est-ce qu'il y aura un but avant la ${minute} lors de ${match} ?`)
								.setFooter(minute)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [minutesEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebuteur) => {
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
									mongoosebuteur.connection.close()
								}
							})
							break;
						}
						case "butwin": {
							const buteur = options.getString("valeur")
							const match = `${options.getString("team1")} - ${options.getString("team2")}`
							const butwinEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor("Marque et gagne")
								.setTitle(`${match}`)
								.setDescription(`Pensez-vous que ${buteur} marquera et son équipe gagnera ?`)
								.setFooter(buteur)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [butwinEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebut) => {
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
									mongoosebut.connection.close()
								}
							})
							break;
						}
						case "butday": {
							const buts = options.getString("valeur")
							const championnat = options.getString("team2")
							const journee = options.getString("team1")
							const butDayEmbed = new MessageEmbed()
								.setColor("AQUA")
								.setAuthor({name: "But journée"})
								.setTitle(`${journee} de ${championnat}`)
								.setDescription(`Pensez-vous qu'il y aura + ou - de ${buts} buts pour la ${journee} de ${championnat}`)
								.setFooter(`+ ou - de ${buts} buts pour la ${journee} de ${championnat}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${options.getString("cote1")} \n ${options.getString("cote2")}`,
									inline: true
								}, );
							interaction.reply({
								embeds: [butDayEmbed]
							})
							const message = await interaction.fetchReply();
							message.react(process.env.ONE)
							message.react(process.env.TWO)
							const status = "open";
							const msgId = message.id;
							mongo().then(async (mongoosebutday) => {
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
									mongoosebutday.connection.close()
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