const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "anniv",
    description: "Souhaiter un bon anniversaire",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'user',
            description: "L'utilisateur a souhaiter",
            type: "USER",
            required: true
        },
    ],

    execute(interaction) {
        const member = interaction.options.getMember('user');
        const embed = new MessageEmbed()
        .setTitle(`🎁 Bon anniversaire ${member.user.username} !`)
        .setColor('BLUE')
        .setDescription(`Toute l'équipe du Club House te souhaite un très bon anniversaire ${member.user.username}`)
        interaction.reply({content: `<@${member.user.id}>`,embeds: [embed]});
    }
}