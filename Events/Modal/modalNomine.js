const { Modal } = require("discord-modals");
const { Formatters, MessageEmbed } = require("discord.js");
const teamsSchema = require("../../Schemas/teamsSchema");
const mongo = require("../../mongo");
const Util = require("../../Utils/function");

module.exports = {
  name: "modalSubmit",

  /**
   * @param { Modal } modal
   */

  async execute(modal) {
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
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");
      const devoue = new TextInputComponent()
        .setCustomId("devoueMembre")
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");
      const dynamique = new TextInputComponent()
        .setCustomId("dynamiqueMembre")
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");
      const compris = new TextInputComponent()
        .setCustomId("comprisMembre")
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");
      const ouest = new TextInputComponent()
        .setCustomId("ouestMembre")
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");

      const six = new MessageActionRow().addComponents(avis);
      const sept = new MessageActionRow().addComponents(devoue);
      const huit = new MessageActionRow().addComponents(dynamique);
      const neuf = new MessageActionRow().addComponents(compris);
      const dix = new MessageActionRow().addComponents(ouest);

      modal2.addComponents(six, sept, huit, neuf, dix);

      await interaction.showModal(modal2);
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
        .setLabel("Quel est votre nominé ?")
        .setStyle("SHORT");

        const onze = new MessageActionRow().addComponents(flop);

        modal2.addComponents(onze);

        await interaction.showModal(modal3);
    }

    if (modal.customId === "nomineModal3") {
      bestFlop = modal.getTextInputValue("avisMembre");
    }
  },
};
