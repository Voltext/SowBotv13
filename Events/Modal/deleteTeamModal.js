const { Modal } = require('discord-modals')
const { Formatters, MessageEmbed } = require('discord.js');
const teamsSchema = require('../../Schemas/teamsSchema')

module.exports = {
  name: "modalSubmit",

  /** 
  * @param { Modal } modal 
  */

  async execute(modal) {
    if(modal.customId === 'modal-customid') {
      const firstResponse = modal.getTextInputValue('textinput-customid');
        
      mongo().then(async (mongooseteam) => {
        try {
          const results = await teamsSchema.find({}, {
            idCapitaine: 1,
            teamName: 1,
            teamMembers: 1,
            _id: 1,
          });
          
          if(results.length === 0) {
            interaction.reply({
              embeds: [Util.errorEmbed("Opération impossible", `Vous ne faites partie d'aucune équipe.`)],
              ephemeral: true
            })
          }
          else {
            results.forEach(async result => {
              if(result.idCapitaine === interaction.user.id) {
                teamsSchema.deleteOne({_id : result._id})
                interaction.reply({
                  embeds: [Util.errorEmbed("Vous avez quitté votre équipe", `En quittant l'équipe dont vous étiez détenteur, tous les joueurs qui composaient aussi votre équipe ont été exlu.`)],
                  ephemeral: true
                })
              }
            })
          }

        }
        catch {
          mongooseteam.connection.close();
        }
      })

      modal.member.guild.channels.cache.get(process.env.ADMIN_FEED).send({
        embeds: [new MessageEmbed().setTitle("Suppression d'équipe").setDescription(`${modal.user.username} vient de supprimer son équipe pour la raison suivante : ${Formatters.codeBlock('markdown', firstResponse)}`).setColor('RED')]
      })

      modal.reply({ 
        embeds: [new MessageEmbed().setTitle("Suppression d'équipe").setDescription(`La suppression de votre équipe a bien été prise en compte pour la raison suivante : ${Formatters.codeBlock('markdown', firstResponse)}`).setColor('GREEN')],
        ephemeral: true
      });
    } 

    
  }
};