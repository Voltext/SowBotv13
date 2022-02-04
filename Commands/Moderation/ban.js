const { CommandInteraction, MessageEmbed } = require("discord.js");
const mongo = require('../../mongo');
const warnSchema = require('../../Schemas/warnSchema');

module.exports = {
    name: "ban",
    description: "Permet de bannir un utilisateur",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: 'user',
            description: "L'utilisateur à timeout",
            type: "USER",
            required: true
        },
        {
            name: 'raison',
            description: "Raison du ban",
            type: "STRING",
            required: true
        },
    ],

    async execute(interaction) {
        const {guild, options} = interaction
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('raison');
        const member = interaction.options.getMember('user');

        const mod = interaction.user.username;
        const userId = member.id;
        const guildId = guild.id;

        const BanEmbedUser = new MessageEmbed()
			.setTitle('Vous avez été banni !')
			.setDescription(`Vous avez été banni du serveur de Sowdred`)
			.setColor('RED');
			BanEmbedUser.addFields({
			name: "Ban par",
			value: `${mod}`,
			inline: true,
		},{
			name: "Durée",
			value: "Permanente",
			inline: true,
		}, {
			name: "Raison",
			value: `${reason}`,
			inline: true,
		});
		BanEmbedUser.setFooter("Pour toute demande de deban, veuillez vous adresser au modérateur qui vous a banni par message privé. Aucun bannissement ne sera annulé avant la fin de la période donnée")

		await member.send({embeds: [BanEmbedUser]});

		member.ban();
		const banEmbed = new MessageEmbed()
			.setTitle('Bannissement permanent')
			.setDescription(
				`<@${member.id}> est bannis de manière permanente.`,
			)
			.addField('Raison: ', reason, true)
			.addField('Bannis par :-', mod, true)
			.setColor('RED');

		guild.channels.cache.get(process.env.ADMIN_FEED).send({
			embeds: [banEmbed],
		});
		const warning = {
			author: mod,
			timestamp: new Date().getTime(),
			sanction: "ban",
			reason: reason
		}

		await mongo().then(async (mongoose) => {
			try {
				await warnSchema.findOneAndUpdate({
					guildId,
					userId,
				}, {
					guildId,
					userId,
					$push: {
						warnings: warning,
					},
				}, {
					upsert: true,
				})
			} finally {
				mongoose.connection.close()
			}
		})
    }
}