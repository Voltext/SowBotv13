const mongo = require('../../mongo');
const awardsSchema = require('../../Schemas/awardsSchema')
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
    required: true,
    choices: [{
      name: "Nolan",
      value: "nolan"
    },
    {
      name: "Just1",
      value: "just1"
    },
    {
      name: "Coco07",
      value: "coco07"
    },
    {
      name: "Samir",
      value: "Samir"
    }
  ]
  }, 
  {
    name: 'meilleur_emblematique',
    description: "Meilleur membre emblématique de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Nolan",
      value: "Nolan"
    },
    {
      name: "Coco07",
      value: "coco07"
    },
    {
      name: "Crapouchou",
      value: "Crapouchou"
    },
    {
      name: "Imperator Grisouille",
      value: "Imperator_grisouille"
    }
  ]
  },
  {
    name: 'meilleur_supporter',
    description: "Meilleur supporter de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Cesare",
      value: "Cesare"
    },
    {
      name: "Pilou",
      value: "Pilou"
    },
    {
      name: "Kiwi",
      value: "Kiwi"
    },
    {
      name: "Isaac",
      value: "Isaac"
    }
  ]
  },
  {
    name: 'meilleur_pronostiqueur',
    description: "Meilleur pronostiqueur de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Joan Sama",
      value: "Joan_Sama"
    },
    {
      name: "Coco07",
      value: "Coco07"
    },
    {
      name: "Samir",
      value: "Samir"
    },
    {
      name: "Gigio27",
      value: "Gigio27"
    }
  ]
  },
  {
    name: 'meilleur_moderateur',
    description: "Meilleur moderateur de l'année",
    type: "STRING",
    required: true,
    choices: [
    {
      name: "Just1",
      value: "Just1"
    },
    {
      name: "Axtinner",
      value: "Axtinner"
    },
    {
      name: "Kiwi",
      value: "Kiwi"
    },
    {
      name: "Grisouille",
      value: "Grisouille"
    }
  ]
  },
  {
    name: 'meilleur_equipe',
    description: "Meilleur equipe de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Juventus",
      value: "Juventus"
    },
    {
      name: "Strasbourg",
      value: "Strasbourg"
    },
    {
      name: "Lyon",
      value: "Lyon"
    },
    {
      name: "Dortmund",
      value: "Dortmund"
    }
  ]
  },
  {
    name: 'pire_avis',
    description: "Avis le plus claqué",
    type: "STRING",
    required: true,
    choices: [{
      name: "Adam",
      value: "Adam"
    },
    {
      name: "Matteo",
      value: "Matteo"
    },
    {
      name: "Ff Cc",
      value: "Ff_Cc"
    },
    {
      name: "sid",
      value: "sid"
    }
  ]
  },
  {
    name: 'membre_devoue',
    description: "Membre le plus dévoué",
    type: "STRING",
    required: true,
    choices: [{
      name: "Kiwi",
      value: "Kiwi"
    },
    {
      name: "Pilou",
      value: "Pilou"
    },
    {
      name: "Cesare",
      value: "Cesare"
    },
    {
      name: "Baba",
      value: "Bab"
    }
  ]
  },
  {
    name: 'membre_dynamique',
    description: "Mmebre le plus dynamique",
    type: "STRING",
    required: true,
    choices: [{
      name: "Nolan",
      value: "Nolan"
    },
    {
      name: "Samir",
      value: "Samir"
    },
    {
      name: "Just1",
      value: "Just1"
    },
    {
      name: "Axtinner",
      value: "Axtinner"
    }
  ]
  },
  {
    name: 'rien_compris',
    description: "Pas compris qu'on était sur un serveur foot",
    type: "STRING",
    required: true,
    choices: [{
      name: "Khuuzi",
      value: "Khuuzi"
    },
    {
      name: "Adam",
      value: "Adam"
    },
    {
      name: "Nolan",
      value: "Nolan"
    },
    {
      name: "Pada",
      value: "Pada"
    }
  ]
  },
  {
    name: 'a_louest',
    description: "Membre le plus à l'ouest",
    type: "STRING",
    required: true,
    choices: [{
      name: "Pada",
      value: "Pada"
    },
    {
      name: "Khuuzi",
      value: "Khuuzi"
    },
    {
      name: "Nolan",
      value: "Nolan"
    },
    {
      name: "sid",
      value: "sid"
    }
  ]
  },{
    name: 'flop',
    description: "Le plus gros flop",
    type: "STRING",
    required: true,
    choices: [{
      name: "Adam",
      value: "Adam"
    },
    {
      name: "Pilou",
      value: "Pilou"
    },
    {
      name: "Pada",
      value: "Pada"
    },
    {
      name: "sid",
      value: "sid"
    }
  ]
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
    const devoue = interaction.options.getString("membre_devoue")
    const dynamique = interaction.options.getString("membre_dynamique")
    const compris = interaction.options.getString("rien_compris")
    const ouest = interaction.options.getString("a_louest")
    const flop = interaction.options.getString("flop")
    
    await mongo().then(async (mongooselock) => {
			try {
				await awardsSchema.findOneAndUpdate({
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
          flop,
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