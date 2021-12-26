const { ContextMenuInteraction, MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
    name: "Réouvrir la prédiction",
    type: "MESSAGE",
    permission: "KICK_MEMBERS",

    /**
     * 
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const msgId = interaction.targetId;
        const status = "open";


        await mongo().then(async (mongoose) => {
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

        const lockEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Prediction Réouverte")
        .setDescription("La prédiction a été réouverte, les utilisateurs peuvent à nouveau participer à cette prédictions.")

        interaction.reply({embeds: [lockEmbed], ephemeral: true})
    }
}
