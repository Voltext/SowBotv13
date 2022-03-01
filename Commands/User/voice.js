const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports ={
    name: "voice",
    description: "Controllez votre salon vocal",
    options: [
        {
            name: "invite",
            type: "SUB_COMMAND",
            description: "Invitez un utilisateur dans votre salon vocal",
            options: [
                {
                    name: "user",
                    type: "USER",
                    required: true,
                    description: "Saisissez l'@ du membre que vous souhaitez inviter"
                }
            ]
        },
        {
            name: "blacklist",
            type: "SUB_COMMAND",
            description: "Bloquez l'accès d'un utilisateur à votre vocal",
            options: [
                {
                    name: "member",
                    type: "USER",
                    required: true,
                    description: "Saisissez l'@ du membre que vous souhaitez blacklist"
                }
            ]
        },
        {
            name: "nom",
            type: "SUB_COMMAND",
            description: "Changez le nom de votre salon",
            options: [
                {
                    name: "texte",
                    type: "STRING",
                    required: true,
                    description: "Saisissez le nom que vous souhaitez pour votre salon"
                }
            ]
        },
        {
            name: "event",
            type: "SUB_COMMAND",
            description: "Lancez un event",
            options: [
                {
                    name: "nevent",
                    type: "STRING",
                    required: true,
                    description: "Saisissez le nom de votre event"
                }, 
                {
                    name: "devent",
                    type: "STRING",
                    required: true,
                    description: "Saisissez une description de votre event"
                }
            ]
        },
        {
            name: "public",
            type: "SUB_COMMAND",
            description: "Faire de votre salon, un salon public",
            options: [
                {
                    name: "choix",
                    type: "STRING",
                    required: true,
                    description: "Saisissez oui ou non",
                    choices: [
                        {name: "Oui", value: "on"},
                        {name: "Non", value: "off"}
                    ]
                }
            ]
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { options, member, guild } = interaction;

        const subCommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;
        const Embed = new MessageEmbed().setColor("GREEN");
        const ownedChannel = client.voiceGenerator.get(member.id);

        if(!voiceChannel) {
            return interaction.reply({embeds: [Embed.setDescription("Vous devez être dans un salon vocal pour effectuer cette commande").setColor("RED")], ephemeral: true});
        }
        if(!ownedChannel || voiceChannel.id !== ownedChannel) {
            return interaction.reply({embeds: [Embed.setDescription("Vous n'êtes pas le proprièétaire de ce salon").setColor("RED")], ephemeral: true});
        }

        switch(subCommand) {
            case "nom": {
                const newName = options.getString("texte");
                if(newName.length > 22 || newName.length < 1) {
                    return interaction.reply({embeds: [Embed.setDescription("Le nom du salon doit être compris entre 1 et 22 caractères.").setColor("RED")], ephemeral: true});
                }
                voiceChannel.edit({name: newName});
                interaction.reply({embeds: [Embed.setDescription(`Le nom du salon a bien été modifié en *${newName}*`)], ephemeral: true})
            }
            break;
            case "invite": {
                const targetMember = options.getMember("user");
                voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: true});
                
                await targetMember.send({embeds: [Embed.setDescription(`${member} vous a invité a rejoindre son salon vocal <#${voiceChannel.id}>`)]})
                interaction.reply({embeds: [Embed.setDescription(`${targetMember} a bien été invité dans votre salon`)], ephemeral: true});
            }
            break;
            case "blacklist": {
                const targetMember = options.getMember("member");
                voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: false});

                if(targetMember.voice.channel && targetMember.voice.channel.id === voiceChannel.id) targetMember.voice.setChannel(null)
                
                await targetMember.send({embeds: [Embed.setDescription(`${member} vous a exclu de son salon vocal <#${voiceChannel.id}>`)]})
                interaction.reply({embeds: [Embed.setDescription(`${targetMember} a bien été exclu de votre salon`)], ephemeral: true});
            }
            break;
            case "public" : {
                const turnChoice = options.getString("choix")
                switch(turnChoice) {
                    case "on" : {
                        voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: null});
                        interaction.reply({embeds: [Embed.setDescription("Vous avez rendu votre salon public et ouvert aux membres")], ephemeral: true})
                    }
                    break;
                    case "off" : {
                        voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: false});
                        interaction.reply({embeds: [Embed.setDescription("Vous avez rendu votre salon privé, seul les personnes invitées pourront rejoindre votre salon")], ephemeral: true})
                    }
                    break
                }
            }
            break
            case "event" : {
                const title = options.getString("nevent")
                const description = options.getString("devent")

                interaction.reply({embeds: [Embed.setDescription("Votre annonce a bien été postée")], ephemeral: true})
                
                guild.channels.cache.get(process.env.EVENT_VOC).send({
                    content: `${member} vient de lancer un événement dans son salon vocal !`,
                    embeds: [new MessageEmbed().setTitle(title).setDescription(`${description} \n Rejoignez le salon en cliquant ici -> <#${voiceChannel.id}>`).setColor("BLUE")]
                })
            }
            break
        }

    }
}