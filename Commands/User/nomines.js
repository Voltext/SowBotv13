const mongo = require('../../mongo');
const awardsSchema = require('../../Schemas/awardsSchema')
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  Modal,
  TextInputComponent,
  MessageActionRow
} = require("discord.js");

module.exports = {
  name: "nomines",
  description: "Permet de voter pour un membre dans chacune catégorie",

  async execute(interaction) {

    const modal = new Modal()
    .setCustomId('nomineModal')
    .setTitle('Votez pour les nominés des Sowards')
    ;

    const meilleur = new TextInputComponent()
    .setCustomId('meilleurMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const emblematique = new TextInputComponent()
    .setCustomId('emblemMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const supporter = new TextInputComponent()
    .setCustomId('supportMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const modo = new TextInputComponent()
    .setCustomId('modoMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const equipe = new TextInputComponent()
    .setCustomId('equipeMeilleur')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');

    const un = new MessageActionRow().addComponents(meilleur);
    const deux = new MessageActionRow().addComponents(emblematique);
    const trois = new MessageActionRow().addComponents(supporter);
    const quatre = new MessageActionRow().addComponents(modo);
    const cinq = new MessageActionRow().addComponents(equipe);

    modal.addComponents(un, deux, trois, quatre, cinq);

    await interaction.showModal(modal);

  }
}