const mongo = require("../../mongo");
const awardsSchema = require("../../Schemas/awardsSchema");
const {
  CommandInteraction,
  MessageEmbed,
  MessageButton,
  Modal,
  TextInputComponent,
  MessageActionRow,
} = require("discord.js");

module.exports = {
  name: "nomines",
  description: "Permet de voter pour un membre dans chacune catégorie",

  async execute(interaction) {
    const modal = new Modal()
      .setCustomId("nomineModal")
      .setTitle("Votez pour les nominés des Sowards");
    const modal2 = new Modal()
      .setCustomId("nomineModal2")
      .setTitle("Votez pour les nominés des Sowards");
    const modal3 = new Modal()
      .setCustomId("nomineModal3")
      .setTitle("Votez pour les nominés des Sowards");

    const meilleur = new TextInputComponent()
      .setCustomId("meilleurMembre")
      .setLabel("Qui est le meilleur membre ?")
      .setStyle("SHORT");
    const emblematique = new TextInputComponent()
      .setCustomId("emblemMembre")
      .setLabel("Qui est le membre le plus emblématique?")
      .setStyle("SHORT");
    const supporter = new TextInputComponent()
      .setCustomId("supportMembre")
      .setLabel("Qui est le meilleur supporter ?")
      .setStyle("SHORT");
    const modo = new TextInputComponent()
      .setCustomId("modoMembre")
      .setLabel("Qui est le meilleur modérateur?")
      .setStyle("SHORT");
    const equipe = new TextInputComponent()
      .setCustomId("equipeMeilleur")
      .setLabel("Quelle est l'équipe la plus représentée ?")
      .setStyle("SHORT");
    const avis = new TextInputComponent()
      .setCustomId("avisMembre")
      .setLabel("Qui a l'avis le plus claqué ?")
      .setStyle("SHORT");
    const devoue = new TextInputComponent()
      .setCustomId("devoueMembre")
      .setLabel("Quei est le membre le plus dévoué?")
      .setStyle("SHORT");
    const dynamique = new TextInputComponent()
      .setCustomId("dynamiqueMembre")
      .setLabel("Qui est le membre le plus dynamique?")
      .setStyle("SHORT");
    const compris = new TextInputComponent()
      .setCustomId("comprisMembre")
      .setLabel("Qui n'a pas compris (serveur foot)?")
      .setStyle("SHORT");
    const ouest = new TextInputComponent()
      .setCustomId("ouestMembre")
      .setLabel("Qui est le plus à l'ouest ?")
      .setStyle("SHORT");
    const flop = new TextInputComponent()
      .setCustomId("flopMembre")
      .setLabel("Qui est le plus gros flop ?")
      .setStyle("SHORT");

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

    modal.addComponents(un, deux, trois, quatre, cinq);
    modal2.addComponents(six, sept, huit, neuf, dix);
    modal3.addComponents(onze);

    await interaction.reply(modal);
  },
};
