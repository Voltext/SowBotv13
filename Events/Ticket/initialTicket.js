const {
    ButtonInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const DB = require("../../Schemas/ticketSchema");
const mongo = require('../../mongo')

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isButton()) return;

        const {
            guild,
            member,
            customId
        } = interaction;
        if (!["player", "bug", "suggestion"].includes(customId)) return;

        const ID = Math.floor(Math.random() * 9000) + 10000;

        await guild.channels.create(`${customId + "-" + ID}`, {
            type: "GUILD_TEXT",
            parent: process.env.TICKETCAT,
            permissionOverwrites: [{
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: process.env.MODO_ID,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: process.env.RESPONSABLE,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: process.env.EVERYONE,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                }
            ],
        }).then(async (channel) => {
            DB.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
                Modo: "Aucun"
            });

            const Embed = new MessageEmbed()
                .setAuthor({
                    name: `${guild.name} | Ticket: ${ID}`,
                    iconURL: guild.iconURL({
                        dynamic: true
                    })
                })
                .setDescription("Votre ticket a bien été ouvert, merci d'attendre patiemment qu'il soit prit en charge par un membre du staff")
                .setFooter({text: "Ces boutons ci-dessous sont réservés aux membre du staff"})

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                .setCustomId('close')
                .setLabel("Sauvegarder")
                .setStyle("SUCCESS")
                .setEmoji("🛡️"),
                new MessageButton()
                .setCustomId("lock")
                .setLabel("Verouiller")
                .setStyle("PRIMARY")
                .setEmoji("🔒"),
                new MessageButton()
                .setCustomId("unlock")
                .setLabel("Deverouiller")
                .setStyle("SECONDARY")
                .setEmoji("🔓"),
                new MessageButton()
                .setCustomId("charge")
                .setLabel("Prendre en charge")
                .setStyle("WARNING")
                .setEmoji("🤝")
            );

            channel.send({
                embeds: [Embed],
                components: [Buttons]
            });

            await channel.send({
                content: `${member}, votre ticket a bien été crée`
            }).then((m) => {
                setTimeout(() => {
                    m.delete().catch(() => {})
                }, 1 * 5000)
            });

            interaction.reply({
                content: `${member}, votre ticket a bien été crée : ${channel}`, 
                ephemeral: true
            });
        });

    },
};