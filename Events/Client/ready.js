require('dotenv').config();
const mongoose = require('mongoose');
const TwitchLive = require("../../Api/twitchlive");
const { MessageEmbed } = require("discord.js");

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

					client.channels.cache.get("796022491688337408").send({
						content: "@everyone",
						embeds: [embed],
					});
					isOnLive=true
				}
			} else {
				if(isOnLive) {
					client.channels.cache.get("796022491688337408").threads.create({
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