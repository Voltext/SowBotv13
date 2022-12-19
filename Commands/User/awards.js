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
      name: "Samir",
      value: "Samir"
    },
    {
      name: "Sunryze",
      value: "Sunryze"
    },
    {
      name: "Cesare",
      value: "Cesare"
    },
    {
      name: "Nolan_ctl",
      value: "Nolan_ctl"
    },
    {
      name: "IsaacNew76",
      value: "IsaacNew76"
    },
    {
      name: "Ff Cc Sowldat",
      value: "Ff_Cc_Sowldat"
    }
  ]
  }, 
  {
    name: 'meilleur_emblematique',
    description: "Meilleur membre emblématique de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Bampy",
      value: "Bampy"
    },
    {
      name: "Adam",
      value: "Adam"
    },
    {
      name: "Crapouchou",
      value: "Crapouchou"
    },
    {
      name: "Imperator Grisouille",
      value: "Imperator_grisouille"
    },
    {
      name: "Samir",
      value: "Samir"
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
      name: "Nolan_ctl",
      value: "Nolan_ctl"
    },
    {
      name: "Samir",
      value: "Samir"
    },
    {
      name: "Petit Kiwi",
      value: "Petit_Kiwi"
    },
    {
      name: "Ff Cc Sowldat",
      value: "Ff_Cc_Sowldat"
    }
  ]
  },
  {
    name: 'meilleur_pronostiqueur',
    description: "Meilleur pronostiqueur de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "c0co07",
      value: "c0co07"
    },
    {
      name: "Nolan_ctl",
      value: "Nolan_ctl"
    },
    {
      name: "Cesare",
      value: "Cesare"
    },
    {
      name: "Ff Cc Sowldat",
      value: "Ff_Cc_Sowldat"
    },
    {
      name: "Milan",
      value: "Milan"
    },
    {
      name: "StrasN3",
      value: "StrasN3"
    }
  ]
  },
  {
    name: 'meilleur_moderateur',
    description: "Meilleur moderateur de l'année",
    type: "STRING",
    required: true,
    choices: [{
      name: "Crapouchou",
      value: "Crapouchou"
    },
    {
      name: "Just1",
      value: "Just1"
    },
    {
      name: "Axtinner",
      value: "Axtinner"
    },
    {
      name: "Petit Kiwi",
      value: "Petit_Kiwi"
    },
    {
      name: "Milan",
      value: "Milan"
    },
    {
      name: "Adam",
      value: "Adam"
    },
    {
      name: "Filou",
      value: "Filou"
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
      name: "OM",
      value: "OM"
    },
    {
      name: "PSG",
      value: "PSG"
    },
    {
      name: "Lyon",
      value: "Lyon"
    },
    {
      name: "Barcelone",
      value: "Barcelone"
    }
  ]
  },
  {
    name: 'pire_avis',
    description: "Avis le plus claqué",
    type: "STRING",
    required: true,
    choices: [{
      name: "Voltext",
      value: "Voltext"
    },
    {
      name: "Matteo",
      value: "Matteo"
    },
    {
      name: "IsaacNew76",
      value: "IsaacNew76"
    },
    {
      name: "sid",
      value: "sid"
    },
    {
      name: "Nolan_ctl",
      value: "Nolan_ctl"
    },
    {
      name: "Sowdred",
      value: "Sowdred"
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
          avis
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