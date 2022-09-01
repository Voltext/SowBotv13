const mongo = require('../../mongo');
const linkTwitchSchema = require('../../Schemas/linkTwitchSchema')
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton
} = require("discord.js");

module.exports = {
  name: "clip",
  description: "Envoyer son clip pour la communauté",
  options: [{
    name: 'lien',
    description: "Lien du clip",
    type: "STRING",
    required: true
  }, ],

  async execute(interaction) {

    const { guild } = interaction

    const lien = interaction.options.getString("lien")
    const clipChannelAdmin = guild.channels.cache.get(
			process.env.CLIPADMIN_FEED,
		);
    
    const embedClip = new MessageEmbed()
					.setColor('BLUE')
					.setTitle(`Nouveau clip !`)
					.setDescription('Utilisez les réactions pour valider ou non ce clip')
					.setURL(lien);

				clipChannelAdmin.send(embedClip).then(message => {
					message.react(process.env.CHECK_ID);
					message.react(process.env.CROSS_ID);
				});

  interaction.reply({
      content: `Le clip a bien été envoyé, il sera soumis à la validation des modérateurs`,
      ephemeral: true
  })
    


  }
}