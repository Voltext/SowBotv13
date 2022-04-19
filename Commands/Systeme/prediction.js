const {
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu,
	MessageAttachment
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
				name: "boost",
				description: "Designe si le prono est une cote boost",
				type: "STRING",
				require: true,
				choices: [{
						name: "Sans boost",
						value: "x1"
					},
					{
						name: "Boost x2",
						value: "x2"
					},
					{
						name: "Boost x3",
						value: "x3"
					},
				]
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const buteurEmbed = new MessageEmbed()
								.setAuthor("Buteur")
								.setTitle(`${match}`);
							if (options.getString("boost") == 'x2') {
								img = "x2.png"
								img_small = "x2_small.png"
								cote1 = cote1 * 2
								cote2 = cote2 * 2
								color = "GOLD"
								buteurEmbed.setImage(`attachment://${img}`)
								buteurEmbed.setThumbnail(`attachment://${img_small}`);
							}
							if (options.getString("boost") == 'x3') {
								img = "x3.png"
								img_small = "x3_small.png"
								cote1 = cote1 * 3
								cote2 = cote2 * 3
								color = "RED"
								buteurEmbed.setImage(`attachment://${img}`)
								buteurEmbed.setThumbnail(`attachment://${img_small}`);
							}
							buteurEmbed.setDescription(`Est-ce que ${buteur} sera buteur lors de ${match} ?`)
								.setColor(color)
								.setFooter(buteur)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il sera buteur \n ${process.env.TWO} : Si vous pensez qu'il ne sera pas buteur`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
							if (options.getString("boost") == 'x1') {
								interaction.reply({
									embeds: [buteurEmbed],
								})
							} else {
								interaction.reply({
									embeds: [buteurEmbed],
									files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
								})
							}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							let cote3 = 3
							const matchEmbed = new MessageEmbed()
								.setAuthor("Score final")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									cote3 = cote3 * 2
									color = "GOLD"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									cote3 = cote3 * 3
									color = "RED"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								matchEmbed.setDescription("Laquelle de ces 2 équipes gagnera le match ?")
								.setColor(color)
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote3} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [matchEmbed],
									})
								} else {
									interaction.reply({
										embeds: [matchEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const butsEmbed = new MessageEmbed()
								.setAuthor("Buts")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									butsEmbed.setImage(`attachment://${img}`)
									butsEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									butsEmbed.setImage(`attachment://${img}`)
									butsEmbed.setThumbnail(`attachment://${img_small}`);
								}
								butsEmbed.setDescription(`Pensez-vous qu'il y aura ${buts} buts dans ce match ?`)
								.setColor(color)
								.setFooter(buts)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il y aura + \n ${process.env.TWO} : Si vous pensez que qu'il y aura -`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [butsEmbed],
									})
								} else {
									interaction.reply({
										embeds: [butsEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const medailleEmbed = new MessageEmbed()
								.setAuthor("Medailles")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									medailleEmbed.setImage(`attachment://${img}`)
									medailleEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									medailleEmbed.setImage(`attachment://${img}`)
									medailleEmbed.setThumbnail(`attachment://${img_small}`);
								}
								medailleEmbed.setDescription(`Pensez-vous que la ${match} aura plus de ${nbMedaille} médailles durant ces JO ?`)
								.setColor(color)
								.setFooter(nbMedaille)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il y aura + \n ${process.env.TWO} : Si vous pensez que qu'il y aura -`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [medailleEmbed],
									})
								} else {
									interaction.reply({
										embeds: [medailleEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							let cote3 = 3
							const matchEmbed = new MessageEmbed()
								.setAuthor("Score -45")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									cote3 = cote3 * 2
									color = "GOLD"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									cote3 = cote3 * 3
									color = "RED"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								matchEmbed.setDescription("Laquelle de ces 2 équipes gagnera le match à la mi-temps ?")
								.setColor(color)
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote3} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [matchEmbed],
									})
								} else {
									interaction.reply({
										embeds: [matchEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							let cote3 = 3
							const matchEmbed = new MessageEmbed()
								.setAuthor("Score +45")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									cote3 = cote3 * 2
									color = "GOLD"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									cote3 = cote3 * 3
									color = "RED"
									matchEmbed.setImage(`attachment://${img}`)
									matchEmbed.setThumbnail(`attachment://${img_small}`);
								}
								matchEmbed.setDescription("Laquelle de ces 2 équipes gagnera le match en seconde période ?")
								.setColor(color)
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va gagner \n ${process.env.CROSS_ID} : Si vous pensez qu'il y aura match nul \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va gagner`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote3} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [matchEmbed],
									})
								} else {
									interaction.reply({
										embeds: [matchEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const cartonEmbed = new MessageEmbed()
								.setAuthor("Cartons")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									cartonEmbed.setImage(`attachment://${img}`)
									cartonEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									cartonEmbed.setImage(`attachment://${img}`)
									cartonEmbed.setThumbnail(`attachment://${img_small}`);
								}
								cartonEmbed.setDescription(`Pensez-vous qu'il y aura ${cartons} cartons dans ce match`)
								.setColor(color)
								.setFooter(cartons)
								.addFields({
									name: 'Prono 1',
									value: `${process.env.ONE} : Si vous pensez qu'il y en aura + \n ${process.env.TWO} : Si vous pensez qu'il y en aura -'`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [cartonEmbed],
									})
								} else {
									interaction.reply({
										embeds: [cartonEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const competEmbed = new MessageEmbed()
								.setAuthor("Competition")
								.setTitle(`${team1} - ${compet}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									competEmbed.setImage(`attachment://${img}`)
									competEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									competEmbed.setImage(`attachment://${img}`)
									competEmbed.setThumbnail(`attachment://${img_small}`);
								}
								competEmbed.setDescription(`Pensez-vous que ${team1} remportera ${compet} ?`)
								.setColor(color)
								.setFooter(`${team1} gagnera ${compet}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'ils la gagneront + \n ${process.env.TWO} : Si vous pensez qu'ils ne la gagneront pas`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [competEmbed],
									})
								} else {
									interaction.reply({
										embeds: [competEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							if (team3 == null || team3 == "") {
								teamClone = `${team1} / ${team2}`
							} else {
								teamClone = `${team1} / ${team2} / ${team3}`
							}
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const teamsEmbed = new MessageEmbed()
								.setAuthor("Equipes gagnent")
								.setTitle(`${teamClone}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									teamsEmbed.setImage(`attachment://${img}`)
									teamsEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									teamsEmbed.setImage(`attachment://${img}`)
									teamsEmbed.setThumbnail(`attachment://${img_small}`);
								}
								teamsEmbed.setDescription(`Pensez-vous que ${teamClone} ne perdront pas (victoire ou nul) ?`)
								.setColor(color)
								.setFooter(`${teamClone}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'ils ne perdront pas + \n ${process.env.TWO} : Si vous pensez qu'ils vont perdre`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [teamsEmbed],
									})
								} else {
									interaction.reply({
										embeds: [teamsEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const butsmEmbed = new MessageEmbed()
								.setAuthor("Buts Multiples")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									butsmEmbed.setImage(`attachment://${img}`)
									butsmEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									butsmEmbed.setImage(`attachment://${img}`)
									butsmEmbed.setThumbnail(`attachment://${img_small}`);
								}
								butsmEmbed.setDescription(`Pensez-vous qu'il y aura ${buts} dans ce match ?`)
								.setColor(color)
								.setFooter(buts)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [butsmEmbed],
									})
								} else {
									interaction.reply({
										embeds: [butsmEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const ecartEmbed = new MessageEmbed()
								.setAuthor("Gagne ecart")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									ecartEmbed.setImage(`attachment://${img}`)
									ecartEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									ecartEmbed.setImage(`attachment://${img}`)
									ecartEmbed.setThumbnail(`attachment://${img_small}`);
								}
								ecartEmbed.setDescription(`Pensez-vous que ${teamwin} gagnera avec au moins ${ecart} buts d'écart ?`)
								.setColor(color)
								.setFooter(`${teamwin} gagnera avec ${ecart}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [ecartEmbed],
									})
								} else {
									interaction.reply({
										embeds: [ecartEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const qualifEmbed = new MessageEmbed()
								.setAuthor("Qualification")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									qualifEmbed.setImage(`attachment://${img}`)
									qualifEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									qualifEmbed.setImage(`attachment://${img}`)
									qualifEmbed.setThumbnail(`attachment://${img_small}`);
								}
								qualifEmbed.setDescription("Laquelle de ces 2 équipes va se qualifier ?")
								.setColor(color)
								.setFooter(match)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que ${options.getString("team1")} va se qualifier \n ${process.env.TWO} : Si vous pensez que ${options.getString("team2")} va se qualifier`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [qualifEmbed],
									})
								} else {
									interaction.reply({
										embeds: [qualifEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const buteursEmbed = new MessageEmbed()
								.setAuthor("Buteurs")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									buteursEmbed.setImage(`attachment://${img}`)
									buteursEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									buteursEmbed.setImage(`attachment://${img}`)
									buteursEmbed.setThumbnail(`attachment://${img_small}`);
								}
								buteursEmbed.setDescription(`Est-ce qu'au moins l'un des 2 : ${buteurs} seront buteur lors de ${match} ?`)
								.setColor(color)
								.setFooter(buteurs)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [buteursEmbed],
									})
								} else {
									interaction.reply({
										embeds: [buteursEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const minutesEmbed = new MessageEmbed()
								.setAuthor("But avant")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									minutesEmbed.setImage(`attachment://${img}`)
									minutesEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									minutesEmbed.setImage(`attachment://${img}`)
									minutesEmbed.setThumbnail(`attachment://${img_small}`);
								}
								minutesEmbed.setDescription(`Est-ce qu'il y aura un but avant la ${minute} lors de ${match} ?`)
								.setColor(color)
								.setFooter(minute)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [minutesEmbed],
									})
								} else {
									interaction.reply({
										embeds: [minutesEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const butwinEmbed = new MessageEmbed()
								.setAuthor("Marque et gagne")
								.setTitle(`${match}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									butwinEmbed.setImage(`attachment://${img}`)
									butwinEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									butwinEmbed.setImage(`attachment://${img}`)
									butwinEmbed.setThumbnail(`attachment://${img_small}`);
								}
								butwinEmbed.setDescription(`Pensez-vous que ${buteur} marquera et son équipe gagnera ?`)
								.setColor(color)
								.setFooter(buteur)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez que oui \n ${process.env.TWO} : Si vous pensez que non`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [butwinEmbed],
									})
								} else {
									interaction.reply({
										embeds: [butwinEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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
							let color = "AQUA"
							let img = "x1.png"
							let img_small = "x1_small.png"
							let cote1 = options.getString('cote1')
							let cote2 = options.getString('cote2')
							const butDayEmbed = new MessageEmbed()
								.setAuthor({
									name: "But journée"
								})
								.setTitle(`${journee} de ${championnat}`);
								if (options.getString("boost") == 'x2') {
									img = "x2.png"
									img_small = "x2_small.png"
									cote1 = cote1 * 2
									cote2 = cote2 * 2
									color = "GOLD"
									butDayEmbed.setImage(`attachment://${img}`)
									butDayEmbed.setThumbnail(`attachment://${img_small}`);
								}
								if (options.getString("boost") == 'x3') {
									img = "x3.png"
									img_small = "x3_small.png"
									cote1 = cote1 * 3
									cote2 = cote2 * 3
									color = "RED"
									butDayEmbed.setImage(`attachment://${img}`)
									butDayEmbed.setThumbnail(`attachment://${img_small}`);
								}
								butDayEmbed.setDescription(`Pensez-vous qu'il y aura + ou - de ${buts} buts pour la ${journee} de ${championnat}`)
								.setColor(color)
								.setFooter(`+ ou - de ${buts} buts pour la ${journee} de ${championnat}`)
								.addFields({
									name: 'Pronostiques',
									value: `${process.env.ONE} : Si vous pensez qu'il y aura + \n ${process.env.TWO} : Si vous pensez qu'il y aura -`,
									inline: true
								}, {
									name: 'Côtes',
									value: `${cote1} \n ${cote2}`,
									inline: true
								}, );
								if (options.getString("boost") == 'x1') {
									interaction.reply({
										embeds: [butDayEmbed],
									})
								} else {
									interaction.reply({
										embeds: [butDayEmbed],
										files: [`./Assets/Predi/${img}`, `./Assets/Predi/${img_small}`]
									})
								}
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