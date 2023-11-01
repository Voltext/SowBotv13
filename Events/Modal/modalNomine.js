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

      console.log(bestMembre)
      modal.reply({ 
        embeds: [new MessageEmbed().setTitle("Message envoyé").setDescription(`Vos nominés ont bien été sauvegardés`).setColor('GREEN')],
        ephemeral: true
      });
    }

    if (modal.customId === "nomineModal2") {
      worstAvis = modal.getTextInputValue("avisMembre");
      bestDevoue = modal.getTextInputValue("devoueMembre");
      bestDynamique = modal.getTextInputValue("dynamiqueMembre");
      pasCompris = modal.getTextInputValue("comprisMembre");
      bestOuest = modal.getTextInputValue("ouestMembre");

      console.log(worstAvis)
      
    }

    if (modal.customId === "nomineModal3") {
      bestFlop = modal.getTextInputValue("avisMembre");

      console.log(bestFlop)
    }
  },
};
