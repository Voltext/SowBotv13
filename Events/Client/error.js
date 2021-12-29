require('dotenv').config();
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "error",
    once: true,
    execute(client) {
        process.on('unhandledRejection', (reason, p) => {

            console.log("[ANTI-CRASH] :: Unhandled Rejection/Catch")
            console.log(reason, p)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + reason + "\n\n" + p + "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })

        process.on('unhandledRejection', (reason, p) => {

            console.log("[ANTI-CRASH] :: Unhandled Rejection/Catch")
            console.log(reason, p)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + reason + "\n\n" + p + "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })

        process.on('unhandledRejection', (reason, p) => {

            console.log("[ANTI-CRASH] :: Unhandled Rejection/Catch")
            console.log(reason, p)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + reason + "\n\n" + p + "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })

        process.on('uncaughtException', (err, origin) => {

            console.log("[ANTI-CRASH] :: Uncaught Exception/Catch")
            console.log(err, origin)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + err + "\n\n" + origin + "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })

        process.on('uncaughtExceptionMonitor', (err, origin) => {

            console.log("[ANTI-CRASH] :: Uncaught Rejection/Catch (Monitor)")
            console.log(err, origin)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + err + "\n\n" + origin + "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })

        process.on('multipleResolves', (type, promise, reason) => {

            console.log("[ANTI-CRASH] :: Multiple resolves")
            console.log(type, promise, reason)

            const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Nouvelle erreur detectée")
            .setDescription("Une erreur a été detectée par le bot ! **\n\nERREUR:\n\n** ```" + type + "\n\n" + promise + + "\n\n" + reason + "\n\n"+ "```")
            .setTimestamp()
            .setFooter("Anti-crash système");

            client.channels.cache.get(process.env.ADMIN_FEED).send({
                embed: errEmbed,
            });
        })
    }
}