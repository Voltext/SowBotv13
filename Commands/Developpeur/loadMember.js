const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "loadmember",
    description: "Charger tous les utilisateurs",
    permission: "ADMINISTRATOR",

    async execute(interaction) {
      const { guild } = interaction

      const channelS = guild.channels.cache.get('893865510440144956')
      const loadMessages = await channelS.messages.fetch({limit:5})

      loadMessages.forEach(async element => {
        let role = "";
        const firstuser = element.content.split('@')
        const userId = firstuser[1].split('>')
        const user = await guild.members.fetch(userId[0]).catch(console.error);
        if(user._roles.includes(process.env.MEMBRE)) {
          role = role + " / Membre";
        }
        if(user._roles.includes(process.env.MODO_ID)) {
          role = role + " / Modérateur";
        }
        if(user._roles.includes(process.env.RESPONSABLE)) {
          role = role + " / Responsable";
        }
        if(user._roles.includes(process.env.ADMIN)) {
          role = role + " / Admin";
        }
        guild.channels.cache.get('796022491688337408').send({
          content: `${user.user.username} / ${role}`
      })
      });
    }
}