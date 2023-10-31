const mongo = require('../../mongo');
const awardsSchema = require('../../Schemas/awardsSchema')
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  Modal,
  TextInputComponent
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
    const avis = new TextInputComponent()
    .setCustomId('avisMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const devoue = new TextInputComponent()
    .setCustomId('devoueMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const dynamique = new TextInputComponent()
    .setCustomId('dynamiqueMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const compris = new TextInputComponent()
    .setCustomId('comprisMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const ouest = new TextInputComponent()
    .setCustomId('ouestMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');
    const flop = new TextInputComponent()
    .setCustomId('flopMembre')
    .setLabel('Quel est votre nominé ?')
    .setStyle('SHORT');

    const un = new MessageActionRow().addComponents(meilleur);
    const deux = new MessageActionRow().addComponents(emblematique);
    const trois = new MessageActionRow().addComponents(supporter);
    const quatre = new MessageActionRow().addComponents(modo);
    const cinq = new MessageActionRow().addComponents(equipe);
    const six = new MessageActionRow().addComponents(avis);
    const sept = new MessageActionRow().addComponents(devoue);
    const huit = new MessageActionRow().addComponents(dynamique);
    const neuf = new MessageActionRow().addComponents(compris);
    const dix = new MessageActionRow().addComponents(ouest);
    const onze = new MessageActionRow().addComponents(flop);

    modal.addComponents(un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze);

    await interaction.showModal(modal);

  }
}