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
                name: "isperfect",
                type: "STRING",
                required: true,
                description: "Saisissez oui ou non",
                choices: [
                    {name: "Oui", value: "oui"},
                    {name: "Non", value: "non"}
                ]
            },
            {
                name: "ecart",
                type: "NUMBER",
                required: false,
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
            case "prono": {
                const libelle = options.getString("texte")
                const max = options.getNumber("max")
                const ecart = options.getNumber("ecart")
                const isPerfect = options.getString("isperfect")

                if(isPerfect === "oui") {
                    const arr = [{libelle: libelle, pointMax: max, isPerfect: true}]
                }
                else {
                    const arr = [{libelle: libelle, pointMax: max, ecart: ecart, isPerfect: false}]
                }

                await mongo().then(async (mongoosseaddprono) => {
                    try {
                        await pronoSchema.insertMany(arr);
                    } catch (error) {
                        console.log(error)
                        mongoosseaddprono.connection.close()
                    }
                })
                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Prono crée")
                .setDescription("Le pronostique a bien été crée et assigné.")

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
        }
    }
}