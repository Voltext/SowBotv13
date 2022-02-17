const { ContextMenuInteraction, MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
    name: "Fermer la prédiction",
    type: "MESSAGE",
    permission: "BAN_MEMBERS",

    /**
     * 
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const msgId = interaction.targetId
        const status = "close";


        await mongo().then(async (mongooselock) => {
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
				mongooselock.connection.close()
			}
		})

        const lockEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Prediction fermée")
        .setDescription("Vous venez de bloquer les intéractions avec cette prédiction. Il n'est donc plus possible pour les utilisateurs de participer à celle-ci.")

        interaction.reply({embeds: [lockEmbed], ephemeral: true})
    }
}
