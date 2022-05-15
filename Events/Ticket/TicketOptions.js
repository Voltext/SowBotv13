const {
    ButtonInteraction,
    MessageEmbed
} = require('discord.js');
const {
    createTranscript
} = require('discord-html-transcripts');
const DB = require("../../Schemas/ticketSchema");
const mongo = require('../../mongo')

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isButton()) return;
        const {
            guild,
            customId,
            channel,
            member
        } = interaction;

        if(interaction.customId === "close" || interaction.customId === "lock" || interaction.customId === "unlock" || interaction.customId === "charge")

        if (!member.permissions.has("KICK_MEMBERS")) return interaction.reply({
            content: 'Vous ne pouvez pas utiliser ces boutons',
            ephemeral: true
        })

        if (!["close", "lock", "unlock", "charge"].includes(customId)) return;

        const Embed = new MessageEmbed().setColor("BLUE")

        await mongo().then(async (mongooseticketopt) => {
            try {
                const results = await DB.findOne({
                    ChannelID: channel.id
                });

                if (results == null) {
                    return interaction.reply({
                        content: "Aucune donnée pour ce ticket. Merci de le supprimer manuellement",
                        ephemeral: true,
                    });
                }

                switch (customId) {
                    case "lock":
                        if (results.Locked == true)
                            return interaction.reply({
                                content: "Ce ticket est actuellement verouillé",
                                ephemeral: true
                            });
                        await DB.updateOne({
                            ChannelID: channel.id
                        }, {
                            Locked: true
                        });
                        Embed.setDescription("🔒 | Ce ticket est maintenant fermé. Aucune modification possible");
                        channel.permissionOverwrites.edit(results.MemberID, {
                            SEND_MESSAGES: false,
                        });
                        interaction.reply({
                            embeds: [Embed]
                        });
                        break;
                    case "unlock":
                        if (results.Locked == false)
                            return interaction.reply({
                                content: "Ce ticket est actuellement déverouillé",
                                ephemeral: true
                            });
                        await DB.updateOne({
                            ChannelID: channel.id
                        }, {
                            Locked: false
                        });
                        Embed.setDescription("🔓 | Ce ticket est maintenant réouvert. Les modifications sont possibles");
                        channel.permissionOverwrites.edit(results.MemberID, {
                            SEND_MESSAGES: true,
                        });
                        interaction.reply({
                            embeds: [Embed]
                        });
                        break;
                    case "charge":
                        await DB.updateOne({
                            ChannelID: channel.id
                        }, {
                            Modo: interaction.user.username
                        });
                        Embed.setDescription(`✅ | ${interaction.user.username} vient de prendre en charge le ticket`);
                        interaction.reply({
                            embeds: [Embed]
                        });
                        break;
                    case "close":
                        if (results.Locked == true)
                            return interaction.reply({
                                content: "Ce ticket est actuellement fermé. Veuillez patienter pour qu'il soit automatiquement supprimé",
                                ephemeral: true
                            });
                        const attachment = await createTranscript(channel, {
                            limit: -1,
                            returnBuffer: false,
                            fileName: `${results.Type} - ${results.TicketID}.html`
                        });
                        await DB.updateOne({
                            ChannelID: channel.id
                        }, {
                            Closed: true
                        });

                        const MEMBER = guild.members.cache.get(results.MemberID);
                        const Message = await guild.channels.cache.get(process.env.TRANSCRIPT).send({
                            embeds: [
                                Embed.setAuthor({
                                    name: MEMBER.user.tag,
                                    iconURL: MEMBER.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                }).setTitle(`Transcript Type: ${results.Type}\nID: ${results.TicketID}`),
                            ],
                            files: [attachment],
                        });

                        interaction.reply({
                            embeds: [Embed.setDescription(`Le transcript est maintenant enregistré [TRANSCRIPT](${Message.url})`), ],
                        });

                        setTimeout(() => {
                            channel.delete();
                        }, 10 * 1000);
                        break;

                }
            } catch {
                mongooseticketopt.connection.close();
            }
        })
    }
}