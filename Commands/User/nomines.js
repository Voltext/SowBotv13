const mongo = require('../../mongo');
const nominesSchema = require('../../Schemas/nominesSchema.js')
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton
} = require("discord.js");

module.exports = {
  name: "nomines",
  description: "Définissez vos nominés",
  options: [{
    name: 'meilleur_membre',
    description: "Meilleur membre de l'année",
    type: "STRING",
    required: true,
  }, 
  {
    name: 'meilleur_emblematique',
    description: "Meilleur membre emblématique de l'année",
    type: "STRING",
    required: true,
  },
  {
    name: 'meilleur_supporter',
    description: "Meilleur supporter de l'année",
    type: "STRING",
    required: true,
  },
  {
    name: 'meilleur_pronostiqueur',
    description: "Meilleur pronostiqueur de l'année",
    type: "STRING",
    required: true,
  },
  {
    name: 'meilleur_moderateur',
    description: "Meilleur moderateur de l'année",
    type: "STRING",
    required: true,
  },
  {
    name: 'meilleur_equipe',
    description: "Meilleur equipe de l'année",
    type: "STRING",
    required: true,
  },
  {
    name: 'pire_avis',
    description: "Avis le plus claqué",
    type: "STRING",
    required: true,
  },
  {
    name: 'membre_devoue',
    description: "Membre le plus dévoué",
    type: "STRING",
    required: true,
  },
  {
    name: 'membre_dynamique',
    description: "Membre le plus dynamique",
    type: "STRING",
    required: true,
  },
  {
    name: 'pas_compris',
    description: "Pas compris qu'on été sur un serveur foot",
    type: "STRING",
    required: true,
  },
  {
    name: 'membre_ouest',
    description: "Membre le plus à l'ouest",
    type: "STRING",
    required: true,
  },
  {
    name: 'membre_flop',
    description: "Le plus gros flop",
    type: "STRING",
    required: true,
  },
],

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
    const devoue = interaction.options.getString("membre_devoue")
    const dynamique = interaction.options.getString("membre_dynamique")
    const compris = interaction.options.getString("pas_compris")
    const ouest = interaction.options.getString("membre_ouest")
    const flop = interaction.options.getString("membre_flop")
    
    await mongo().then(async (mongooselock) => {
			try {
				await nominesSchema.findOneAndUpdate({
					userId,
				}, {
          userId,
          membre,
          emblematique,
          supporter,
          prono,
          modo,
          equipe,
          avis,
          devoue,
          dynamique,
          compris,
          ouest,
          flop
				}, {
					upsert: true,
				})
			} catch(err) {
                console.log(err)
				        mongooselock.connection.close()
			}
		})

  interaction.reply({
      content: `Vos réponses ont bien été sauvegardées. Vous pouvez à tout moment les changer en refaisant la même commande.`,
      ephemeral: true
  })
    


  }
}