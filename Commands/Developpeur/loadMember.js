const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "loadmember",
    description: "Charger tous les utilisateurs",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
      const { guild } = interaction
      let count = 0;

      const members = await guild.members.fetch();

      members.forEach(async element => {
        const user = element.user.username;
        const roles = element._roles;
        let role = "";
        if(roles.includes(process.env.MEMBRE)) {
          role = role + "Membre /";
        }
        if(roles.includes(process.env.MODO_ID)) {
          role = role + "Modérateur /";
        }
        if(roles.includes(process.env.RESPONSABLE)) {
          role = role + "Responsable /";
        }
        if(roles.includes(process.env.ADMIN)) {
          role = role + "Admin /";
        }
        count = count + 1;
        guild.channels.cache.get('796022491688337408').send({
          content: `${user} / ${role}`
      })
      });
      interaction.followUp({
        content: `${count}`
      })
    }
}