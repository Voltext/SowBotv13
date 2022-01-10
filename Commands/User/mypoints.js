const { MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const rankPrediSchema = require('../../Schemas/rankPredictSchema')

module.exports = {
    name: "mypoints",
    description: "Permet a un utilisateur de connaître son nombre de points prédiction",

    execute(interaction) {
      const userId = interaction.user.id
      const username = interaction.user.username
      let points = 0;
      const rankEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription("Voici tous vos points accumulés au niveau des prédictions");

    mongo().then(async (mongoose2) => {
        try {
            const userObj = await rankPrediSchema.findOne({
                userId,
            }, {
                points: 1,
                userName: 1,
                _id: 0,
            });
            if (userObj === null) {
                rankEmbed.setTitle(`Les points de prédictions de ${username}`)
                rankEmbed.addField('Vos points actuels', `0 point`, true)
            }
            else {
                rankEmbed.setTitle(`Les points de prédictions de ${username}`)
                rankEmbed.addField('Vos points actuels', `${userObj.points} points`, true)
            }
            interaction.reply({embeds: [rankEmbed] , ephemeral: true });
        } finally {
            mongoose2.connection.close()
        }
    })
    }
}