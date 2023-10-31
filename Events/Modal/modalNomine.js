const { Formatters, MessageEmbed, Modal,
  TextInputComponent,
  MessageActionRow } = require("discord.js");
const teamsSchema = require("../../Schemas/teamsSchema");
const mongo = require("../../mongo");
const Util = require("../../Utils/function");

module.exports = {
  name: "modalSubmit",

  /**
   * @param { Modal } modal
   */

  async execute(modal, client) {
    let bestMembre = "";
    let emblematiqueMembre = "";
    let bestSupporter = "";
    let bestModo = "";
    let bestTeam = "";
    let worstAvis = "";
    let bestDevoue = "";
    let bestDynamique = "";
    let pasCompris = "";
    let bestOuest = "";
    let bestFlop = "";

    if (modal.customId === "nomineModal") {
      bestMembre = modal.getTextInputValue("meilleurMembre");
      emblematiqueMembre = modal.getTextInputValue("emblemMembre");
      bestSupporter = modal.getTextInputValue("supportMembre");
      bestModo = modal.getTextInputValue("modoMembre");
      bestTeam = modal.getTextInputValue("equipeMeilleur");

      const modal2 = new Modal()
        .setCustomId("nomineModal2")
        .setTitle("Votez pour les nominés des Sowards");

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

      const six = new MessageActionRow().addComponents(avis);
      const sept = new MessageActionRow().addComponents(devoue);
      const huit = new MessageActionRow().addComponents(dynamique);
      const neuf = new MessageActionRow().addComponents(compris);
      const dix = new MessageActionRow().addComponents(ouest);

      modal2.addComponents(six, sept, huit, neuf, dix);

      await client.showModal(modal2);
    }

    if (modal.customId === "nomineModal2") {
      worstAvis = modal.getTextInputValue("avisMembre");
      bestDevoue = modal.getTextInputValue("devoueMembre");
      bestDynamique = modal.getTextInputValue("dynamiqueMembre");
      pasCompris = modal.getTextInputValue("comprisMembre");
      bestOuest = modal.getTextInputValue("ouestMembre");

      const modal3 = new Modal()
        .setCustomId("nomineModal3")
        .setTitle("Votez pour les nominés des Sowards");

        const flop = new TextInputComponent()
        .setCustomId("flopMembre")
        .setLabel("Qui est le plus gros flop ?")
        .setStyle("SHORT");

        const onze = new MessageActionRow().addComponents(flop);

        modal3.addComponents(onze);

        await modal.showModal(modal3);
    }

    if (modal.customId === "nomineModal3") {
      bestFlop = modal.getTextInputValue("avisMembre");
    }
  },
};
