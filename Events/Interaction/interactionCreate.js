const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor("RED")
                    .setDescription("⛔ Une erreur est survenue pendant l'utilisation de la commande")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client)
        }
        if (interaction.isSelectMenu()) {
            if (interaction.customId === 'setPrediction') {
                const message = interaction.message;
                switch (interaction.values[0]) {
                    case 'buteur':
                        let filter = (m) => m.author.id === interaction.user.id;
                        interaction.reply({
                                content: "Qui est le potentiel buteur du pronostique ?",
                                ephemeral: true
                            })
                            .then(() => {
                                interaction.channel.awaitMessages({
                                        filter,
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    })
                                    .then(collected => {
                                        const buteur = collected.first().content;
                                        const buteurEmbed = new MessageEmbed()
                                            .setTitle("Pronostique buteur")
                                            .setDescription(`Est-ce que ${buteur} sera buteur ce soir ?`)
                                            .addFields({
                                                name: 'Prono 1',
                                                value: `${process.env.ONE} : Si vous pensez qu'il sera buteur`,
                                                inline: true
                                            }, {
                                                name: 'Prono 2',
                                                value: `${process.env.TWO} : Si vous pensez qu'il ne sera pas buteur`,
                                                inline: true
                                            }, );
                                        interaction.followUp({
                                            embeds: [buteurEmbed]
                                        }).then(message => {
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
                                        })
                                    })
                                    .catch(collected => {
                                        interaction.followUp('Looks like nobody got the answer this time.');
                                    });
                            });
                        break;
                }
            }
        }
    }
}