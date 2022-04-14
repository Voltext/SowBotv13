const {
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const mongo = require('../../mongo');
const reponseSchema = require('../../Schemas/reponseSchema');
const battleSchema = require('../../Schemas/battleSchema');
const pronoSchema = require('../../Schemas/pronoSchema')

module.exports = {
    name: "battle",
    description: "Gérer les battle",
    permissions: "KICK_MEMBERS",
    options: [{
            name: "reset",
            type: "SUB_COMMAND",
            description: "Reset les battle, reponses et pronos",
        },
        {
            name: "prono",
            type: "SUB_COMMAND",
            description: "Créer un pronostique",
            options: [{
                name: "texte",
                type: "STRING",
                required: true,
                description: "Saisissez un pronostique"
            }, 
            {
                name: "max",
                type: "NUMBER",
                required: true,
                description: "Saisissez la valeur max"
            },
            {
                name: "ecart",
                type: "NUMBER",
                required: true,
                description: "Saisissez les points perdu par ecart"
            },]
        },
        {
            name: "results",
            type: "SUB_COMMAND",
            description: "Changez le nom de votre salon",
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const {
            options,
            member,
            guild
        } = interaction;

        const subCommand = options.getSubcommand();

        switch (subCommand) {
            case "reset": {
                await mongo().then(async (mongooseresetprono) => {
                    try {
                        await pronoSchema.deleteMany({})
                    } finally {
                        mongooseresetprono.connection.close()
                    }
                })
                await mongo().then(async (mongooseresetbattle) => {
                    try {
                        await battleSchema.deleteMany({})
                    } finally {
                        mongooseresetbattle.connection.close()
                    }
                })
                await mongo().then(async (mongooseresetreponse) => {
                    try {
                        await reponseSchema.deleteMany({})
                    } finally {
                        mongooseresetreponse.connection.close()
                    }
                })
                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Battle reset")
                .setDescription("Le système de Battle a été reset.")

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
        }
    }
}