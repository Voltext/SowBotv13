const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "prediction",
    description: "Permet de créer une prédiction",
    permission: "KICK_MEMBERS",

    execute(interaction) {
      const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('setPrediction')
					.setPlaceholder('Selectionnez un type de prédiction')
					.addOptions([
						{
							label: 'Résultat final',
							description: 'Quel équipe gagnera le match',
							value: 'final',
						},
						{
							label: '+/- Buts',
							description: 'Le nombre de buts marqués',
							value: 'but',
            },
            {
							label: 'Cartons',
							description: 'Le nombre de carton dans ce match',
							value: 'cartons',
            },
            {
							label: '-45 min',
							description: 'Y-aura-t-il un but dans les 45 premières minutes ?',
							value: 'but45',
            },
            {
							label: 'Buteur',
							description: 'Est-ce qu\'un certains joueurs marquera dans ce match ?',
							value: 'buteur',
						},
					]),
			);
        interaction.reply({ content: 'De quel type voulez vous créer une prédiction ?!', components: [row], ephemeral: true });
    }
}