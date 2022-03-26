const { CommandInteraction } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "timeout",
    description: "Permet a un utilisateur d'être bloqué des salons vocaux et textuels",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: 'user',
            description: "L'utilisateur à timeout",
            type: "USER",
            required: true
        },
        {
            name: 'lenght',
            description: "Durée du timeout",
            type: "STRING",
            required: true
        },
        {
            name: 'reason',
            description: "Raison du timeout",
            type: "STRING",
            required: true
        }
    ],

    execute(interaction) {
        const user = interaction.options.getUser('user');
        const lenght = interaction.options.getString('lenght');
        const reason = interaction.options.getString('reason');
        const member = await interaction.guild.members.fetch(user.id);

        const timeIsMs = ms(lenght)
        if(!timeIsMs)
            return interaction.reply({ content: "Vous devez spécifier une durée valide : Exemple 10s pour 10 secondes", ephemeral: true });

        member.timeout(timeIsMs, reason);
        interaction.reply({ content: `Vous avez correctement timeout ${user} pour ${lenght} -> ${reason}`, ephemeral: true });
    }
}