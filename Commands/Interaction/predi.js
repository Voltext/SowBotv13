const {
    ContextMenuInteraction,
    MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
    name: "predi",
    description: "Gestion des predictions",
    options: [{
            name: "closepredi",
            type: "SUB_COMMAND",
            description: "Saisissez l'identifiant du message",
            options: [{
                name: "idmessage",
                type: "STRING",
                required: true,
                description: "Saisissez le nom du joueur recherché",
                autocomplete: true
            }]
        },
        {
            name: "openpredi",
            type: "SUB_COMMAND",
            description: "Saisissez l'identifiant du message",
            options: [{
                name: "idmessage",
                type: "STRING",
                required: true,
                description: "Saisissez le nom du joueur recherché",
                autocomplete: true
            }]
        }
    ],

    /**
     * 
     * @param {ContextMenuInteraction} interaction
     */
    async execute(interaction) {
        const {
            options,
            guild
        } = interaction;
        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case "close": {
                const status = "close";
                const msgId = interaction.options.getString("idmessage")
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
                    } catch {
                        console.log("Erreur script lock prediction: lockpredi(30)")
                        mongooselock.connection.close()
                    }
                })

                const lockEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Prediction fermée")
                    .setDescription("Vous venez de bloquer les intéractions avec cette prédiction. Il n'est donc plus possible pour les utilisateurs de participer à celle-ci.")

                interaction.reply({
                    embeds: [lockEmbed],
                    ephemeral: true
                })
                break;
            }
            case "open": {
                const status = "open";
                const msgId = interaction.options.getString("idmessage")
                await mongo().then(async (mongooseopen) => {
                    try {
                        await prediSchema.findOneAndUpdate({
                            msgId,
                        }, {
                            msgId,
                            status,
                        }, {
                            upsert: true,
                        })
                    } catch {
                        console.log("Erreur script delock prediction: openpredi(30)")
                        mongooseopen.connection.close()
                    }
                })

                const lockEmbed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Prediction Réouverte")
                    .setDescription("La prédiction a été réouverte, les utilisateurs peuvent à nouveau participer à cette prédictions.")

                interaction.reply({
                    embeds: [lockEmbed],
                    ephemeral: true
                })
                break;
            }
        }

    }
}