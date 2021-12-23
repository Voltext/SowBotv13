require('dotenv').config();
const mongoose = require('mongoose');
const TwitchLive = require("../../Api/twitchlive");
const TwitchSchedule = require("../../Api/twitchschedule");
const { MessageEmbed } = require("discord.js");
const schedule = require('node-schedule');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("✅ Le bot est actuellement en ligne");
        client.user.setActivity("le serveur...", { type : "WATCHING"});

        let isOnLive = false;
		const getLive = new TwitchLive();
		//const channel = client.channels.cache.get(process.env.TWITCH_LIVE);
		setInterval(async function () {
			let infos = await getLive.isLive();
			if (Object.keys(infos.data).length > 0) {
				if(isOnLive === false) {
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
					isOnLive=true
				}
			} else {
				if(isOnLive) {
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
					isOnLive=false;
			}
		}, 2 * 60 * 1000);

		const getSchedule = new TwitchSchedule();
		schedule.scheduleJob('0 0 * * *', async () => {

			const programme = client.channels.cache.get(process.env.PROGRAMME);
			programme.bulkDelete(1);

			const prog = await getSchedule.Schedule()
			if (prog.data.segments !== null) {
				console.log(prog.data)
				const programmation = prog.data.segments;
				const embed = new MessageEmbed()
					.setTitle("Programme de la semaine")
					.setColor("PURPLE")
					.setDescription("Voici le programme prévu pour la semaine")
					.setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/191aab0a-e1ac-40c7-bfe5-e86a1257d598-profile_image-300x300.png")
					.setURL("http://twitch.tv/sowdred");
					programmation.forEach(function(elem) {
						const date = elem.start_time.split("T")[0];
						const heure = elem.start_time.split("T")[1];
						embed.addFields({
							name: "Date début",
							value: `${date} ${heure}`,
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
			}
			else {
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
		})


        mongoose.connect(process.env.MONGO_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("✅ La base de donnée est connectée")
        }).catch((err) => {
            console.log(err)
        });
    }
}