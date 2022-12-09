const mongo = require('../../mongo');
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton
} = require("discord.js");

module.exports = {
  name: "awards",
  description: "Envoyer son clip pour la communauté",
  options: [{
    name: 'meilleur_membre',
    description: "Meilleur membre de l'année",
    type: "STRING",
    required: true
  }, 
  {
    name: 'meilleur_emblematique',
    description: "Meilleur membre emblématique de l'année",
    type: "STRING",
    required: true
  },
  {
    name: 'meilleur_supporter',
    description: "Meilleur supporter de l'année",
    type: "STRING",
    required: true
  },
  {
    name: 'meilleur_pronostiqueur',
    description: "Meilleur pronostiqueur de l'année",
    type: "STRING",
    required: true
  },
  {
    name: 'meilleur_moderateur',
    description: "Meilleur moderateur de l'année",
    type: "STRING",
    required: true
  },
  {
    name: 'meilleur_equipe',
    description: "Meilleur equipe de l'année",
    type: "STRING",
    required: true
  },
  {
    name: 'pire_avis',
    description: "Avis le plus claqué",
    type: "STRING",
    required: true
  },],

  async execute(interaction) {

    const { guild } = interaction
    const userId = interaction.user.id

    const membre = interaction.options.getString("meilleur_membre")
    const emblematique = interaction.options.getString("meilleur_emblematique")
    const supporter = interaction.options.getString("meilleur_supporter")
    const prono = interaction.options.getString("meilleur_pronostiqueur")
    const modo = interaction.options.getString("meilleur_moderateur")
    const equipe = interaction.options.getString("meilleur_equipe")
    const avis = interaction.options.getString("pire_avis")
    
    await mongo().then(async (mongooselock) => {
			try {
				await prediSchema.findOneAndUpdate({
					userId,
				}, {
          userId,
          membre,
          emblematique,
          supporter,
          prono,
          modo,
          equipe,
          avis
				}, {
					upsert: true,
				})
			} catch {
                console.log("Erreur script lock prediction: lockpredi(30)")
				        mongooselock.connection.close()
			}
		})

  interaction.reply({
      content: `Vos réponses ont bien été sauvegardées. Vous pouvez à tout moment les changer en refaisant la même commande.`,
      ephemeral: true
  })
    


  }
}