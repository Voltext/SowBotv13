const {
  ContextMenuInteraction,
  MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const prediSchema = require('../../Schemas/prediSchema')

module.exports = {
  name: "Tirer au sort un membre",
  type: "MESSAGE",
  permission: "BAN_MEMBERS",

  /**
   * 
   * @param {ContextMenuInteraction} interaction
   */
  async execute(interaction) {
    const msgId = interaction.targetId;
    const channelId = interaction.channelId

    const {
      guild
    } = interaction
    const channelS = guild.channels.cache.get(channelId)

    const fetchMsg = await channelS.messages.fetch(msgId);
    let reactions = fetchMsg.reactions.cache.find(emoji => emoji.emoji.name == '🎉');

    fetchMsg.reactions.cache.map(async (reaction) => {
      let usersThatReacted = []; //Initiates usersThatReacted as an array
      if (reaction.emoji.name !== "🎉") return; //If the reaction checked isn't equal to ✅, return
      let reactedUsers = await reaction.users.fetch(); //Fetches the users that reacted with the ✅ on the collected message
      reactedUsers.map((user) => { //Maps out every user that reacted with ✅
        usersThatReacted.push(`**${user.username}#${user.discriminator}**`); //Pushes each user into the array with formatting **
      });
      let users = usersThatReacted.join('-').trim(); //Joins all items in the array with a hyphen 
      let randomuser = Math.floor(Math.random() * usersThatReacted.length); //Selects a random number, based on the length of the above array
      guild.channels.cache.get(channelId).send({
        content: `Le gagnant du tirage au sort est : ${usersThatReacted[randomuser]}. Félicitations !`
      });
    })
  }
}