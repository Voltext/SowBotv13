require('dotenv').config();
const mongoose = require('mongoose');
const TwitchLive = require("../../Api/twitchlive");
const TwitchSchedule = require("../../Api/twitchschedule");
const {
	MessageEmbed,
	MessageAttachment
} = require("discord.js");
const schedule = require('node-schedule');
const colors = require('colors');
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')
const Cards = require("../../Api/card");
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const cardCollectionSchema = require('../../Schemas/cardCollectionSchema')
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')
const axios = require('axios')
const {
	registerFont,
	createCanvas,
	loadImage
} = require("canvas")
registerFont('./Assets/Fonts/DINNextLTPro-Black.ttf', {
	family: 'DINNextLTPro-Black'
})
registerFont('./Assets/Fonts/DINNextLTPro-UltraLightIt.ttf', {
	family: 'DINNextLTPro-UltraLightIt'
})
registerFont('./Assets/Fonts/DINNextRoundedLTPro-Bold.ttf', {
	family: 'DINNextRoundedLTPro-Bold'
})
const Moment = require("moment");
const playerSchema = require('../../Schemas/playerSchema');

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		Moment.locale("fr");
		console.log(
			`
██████ ██████ ██      ██  ██  ███████  ████████  ██████████
██     ██  ██ ██      ██ ██   ██   ██  ██    ██      ██
██████ ██  ██ ██  ██  ██      ██ ██    ██    ██      ██
    ██ ██  ██ ██  ██  ██      ██   ██  ██    ██      ██
██████ ██████ ██████████      ███████  ████████      ██
`.rainbow +
			`
Bot discord en relation avec le serveur discord de ${'Sowdred !'.blue} !
Le BOT est ${'en ligne !'.green}

${'↓ LOGS ↓'.bgBlue}`,
		);
		console.log("✅ Le bot est actuellement en ligne");
		client.user.setActivity("le serveur...", {
			type: "WATCHING"
		});

		const channelS = client.channels.cache.get(process.env.PREDICTIONS)
		channelS.messages.fetch()
			.then(console.log("Loaded"))
		const channelD = client.channels.cache.get(process.env.DEMANDES)
		channelD.messages.fetch()
			.then(console.log("Loaded"))

		let isOnLive = false;
		const getLive = new TwitchLive();
		//const channel = client.channels.cache.get(process.env.TWITCH_LIVE);
		setInterval(async function () {
			let infos = await getLive.isLive();
			if (Object.keys(infos.data).length > 0) {
				if (isOnLive === false) {
					client.user
						.setActivity('EN LIVE', {
							type: 'STREAMING',
							url: 'http://twitch.tv/sowdred',
						});
					const embed = new MessageEmbed()
						.setTitle(infos.data[0].title)
						.setColor("PURPLE")
						.setDescription("Le live est lancé, Venez vivre ce match avec nous !")
						.setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
						.setURL("http://twitch.tv/sowdred");

					client.channels.cache.get(process.env.TWITCH_LIVE).send({
						content: "@everyone",
						embeds: [embed],
					});
					isOnLive = true
				}
			} else {
				if (isOnLive) {
					client.channels.cache.get(process.env.TWITCH_LIVE).threads.create({
						name: 'Votre avis sur le live ?',
						autoArchiveDuration: 60,
						reason: "Qu'avez vous pensez de ce match ?",
					});
				}
				client.user
					.setActivity('?help | OFFLINE', {
						type: 'PLAYING',
					});
				isOnLive = false;
			}
		}, 2 * 60 * 1000);

		const getSchedule = new TwitchSchedule();
		schedule.scheduleJob('0 0 * * *', async () => {

			const programme = client.channels.cache.get(process.env.PROGRAMME);
			programme.bulkDelete(1);

			const prog = await getSchedule.Schedule()
			if (prog.data.segments !== null) {
				const programmation = prog.data.segments;
				const embed = new MessageEmbed()
					.setTitle("Programme de la semaine")
					.setColor("PURPLE")
					.setDescription("Voici le programme prévu pour la semaine")
					.setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
					.setURL("http://twitch.tv/sowdred");
				programmation.forEach(function (elem) {
					const date = Moment(elem.start_time).format('DD-MM-YYYY HH:MM')
					embed.addFields({
						name: "Date début",
						value: `${date}`,
						inline: true,
					}, {
						name: "Titre",
						value: `${elem.title}`,
						inline: true,
					}, {
						name: "Catégorie",
						value: `${elem.category.name}`,
						inline: true,
					});
				})
				client.channels.cache.get(process.env.PROGRAMME).send({
					content: "Voici le programme de la semaine",
					embeds: [embed],
				});
			} else {
				const embed = new MessageEmbed()
					.setTitle("Programme de la semaine")
					.setColor("PURPLE")
					.setDescription("Voici le programme prévu pour la semaine")
					.setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
					.setURL("http://twitch.tv/sowdred")
					.addField("Programme introuvable", "Le programme n'a pas encore été défini");

				client.channels.cache.get(process.env.PROGRAMME).send({
					content: "Voici le programme de la semaine",
					embeds: [embed],
				});
			}
			const rankchannel = client.channels.cache.get(process.env.RANK_CHANNEL);
			rankchannel.bulkDelete(1);
			let placement = 1;

			await mongo().then(async (mongooseclassement) => {
				try {
					const results = await rankPrediSchema.find({}, {
						points: 1,
						userName: 1,
						_id: 0
					}, {
						limit: 20
					}).sort({
						"points": -1
					});


					const rankEmbed = new MessageEmbed()
						.setTitle("Classement des prédicteurs")
						.setDescription("Voici le TOP 20 des meilleurs prédicteurs du serveur");

					if (results.length === 0) {
						rankEmbed.addField("Classement", "Aucun utilisateur ne fait actuellement parti de ce classement")
					} else {
						const canvas = createCanvas(1920, 1080)
						const ctx = canvas.getContext('2d')

						const background = await loadImage(
							path.join(__dirname, `../../Assets/Base/Classement.png`)
						)
						let x = 0
						let y = 0

						let xp = 350
						let yp = 340

						let x1 = 890
						let y1 = 340

						ctx.drawImage(background, x, y)
						results.forEach(function (elem) {
							ctx.fillStyle = '#ffffff'
							ctx.font = '30px DINNextLTPro-Black'
							let name1 = `${elem.userName}`
							ctx.fillText(name1, xp, yp)

							ctx.fillStyle = '#ffffff'
							ctx.font = '30px DINNextLTPro-Black'
							let points = `${elem.points}`
							ctx.fillText(points, x1, y1)

							yp = yp + 65;
							y1 = y1 + 65;

							if (placement === 10) {
								xp = 1060
								yp = 340

								x1 = 1590
								y1 = 340
							}

							placement = placement + 1;
						})
						const attachment = new MessageAttachment(canvas.toBuffer())
						client.channels.cache.get(process.env.RANK_CHANNEL).send({
							files: [attachment]
						});
					}
				} catch {
					console.log("Erreur event ready: ready(226)")
					mongooseclassement.connection.close();
				}
			});
		})

		schedule.scheduleJob('*/30 17-23 * * *', async () => {
			client.channels.cache.get(process.env.MANAGE_CARD).send({
				content: `-------------------`,
			})
			const getUsers = new Cards()

			const ArrId = []

			const card = await getUsers.getUserCard()
			if (card.data.length !== 0) {
				const data = card.data

				data.forEach(async function (elem) {
					const userName = elem.user_name

					await mongo().then(async (mongoosepredi) => {
						try {
							const results = await linkTwitchSchema.findOne({
								userName,
							});
							if (results === null) {
								client.channels.cache.get(process.env.MANAGE_CARD).send({
									content: `Le compte ${userName} n'est link à aucun compte`,
								})
							} else {
								const rewardId = elem.id;
								const userId = results.userId

								const files = fs.readdirSync(path.join(__dirname, `../../Assets/Cards/`))
								let chosenFile = files[Math.floor(Math.random() * files.length)]

								await mongo().then(async (mongooselock) => {
									try {
										await cardCollectionSchema.findOneAndUpdate({
											userId,
										}, {
											userId,
											$push: {
												cards: [chosenFile],
											},
										}, {
											upsert: true,
										})
									} catch {
										console.log("Erreur event ready: ready(276)")
										mongooselock.connection.close()
									}
								})
								headers = {
									'Authorization': 'Bearer ' + process.env.TOKEN_SOW,
									'Client-Id': process.env.CLIENT_ID_SOW,
									'Content-Type': 'application/json'
								}

								dataCards = {
									'status': 'FULFILLED'
								}

								axios.patch(`https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?id=${rewardId}&broadcaster_id=727375071&reward_id=dd830257-d211-41fa-9c41-89472c032a9f`, dataCards, {
									'headers': headers
								}).then(resp => {
									console.log(resp.data);
								}).catch(err => console.error(err))
								client.channels.cache.get(process.env.MANAGE_CARD).send({
									content: `Nouvelle récupération`,
									embeds: [new MessageEmbed().setTitle("Nouvelle carte récupérée").setDescription(`${userName} a récupérée la carte ${chosenFile}`)],
								})
							}
						} catch {
							console.log("Erreur event ready: ready(301)")
							mongoosepredi.connection.close();
						}
					});
				})
			}
		})

		schedule.scheduleJob('37 * * * *', async () => {
			mongo().then(async (mongooserank) => {
				try {
					const results = await playerSchema.find({
						stamina: {
							$lt: 100
						}
					});

					results.forEach(function (member) {
						const userId = member.userId
						let update = {}
						if (member.stamina > 90) {
							update = {
								stamina: 100
							}
						} else {
							update = {
								stamina: member.stamina + 10
							}
						}
						mongo().then(async (mongooselock) => {
							try {
								await playerSchema.findOneAndUpdate({
									userId
								}, update)

							} catch {
								console.log("Erreur script assignation carte : card(62)")
								mongooselock.connection.close()
							}
						})
					})



				} catch (err) {
					console.log(err)
					console.log("Erreur création du classement : rank(103)")
					mongooserank.connection.close();
				}
			});
		})



		mongoose.connect(process.env.MONGO_PATH, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			console.log("✅ La base de donnée est connectée")
		}).catch((err) => {
			console.log(err)
		});

		require("../../Systems/FilterSys")(client);
	}
}