const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require("discord.js");
require('dotenv').config();

module.exports = {
    name: "help",
    description: "Permet d'acceder à la liste des commandes",

    run: async (client, message, args) => {
        const directories = [
            ...new Set(client.commands.map((cmd) => cmd.directory)),
        ];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.directory === dir)
                .map((cmd) => {
                    return {
                        name: cmd.name || "Aucun nom pour cette commande",
                        description: cmd.description || "Aucune description pour cette commande",
                    };
                });
            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new MessageEmbed()
            .setDescription("Choisissez une catégorie pour visualiser les commandes qui la compose");

        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId("help-menu")
                .setPlaceholder("Selectionnez une catégorie")
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `Commande venant de ${cmd.directory} category`,
                        }
                    })
                )
            ),
        ];
        const initialMessage = await message.channel.send({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageCollector({
            filter,
            componentType: "SELECT_MENU",
        });

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new MessageEmbed()
                .setTitle(`${directory} : commandes`)
                .setDescription("Voici la liste des commandes")
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true,
                        };
                    })
                );

            interaction.update({
                embeds: [categoryEmbed]
            })
        });

        collector.on('end', () => {
            initialMessage.edit({
                components: components(true)
            })
        })
    },
};