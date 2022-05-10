const { Perms } = require("../Utils/Permissions");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    const Table = new Ascii("Commandes");

    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) {
            return Table.addRow(
                file.split("/")[7],
                "🔴 ERREUR",
                "Nom de la commande introuvable"
            );
        }
        if (command.permission) {
            if (Perms.includes(command.permission))
            command.defaultPermission = false;
            else {
                return Table.addRow(
                    command.name,
                    "🔴 ERREUR",
                    "Vous n'avez pas la permission"
                );
            }
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "🟢 Chargée");
    });

    console.log(Table.toString());

    client.on("ready", async () => {
        const MainGuild = await client.guilds.cache.get("796015674513686548");

        MainGuild.commands.set(CommandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArray.find(
                    (c) => c.name === commandName
                ).permission;
                if (!cmdPerms) return null;

                return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
            };
        });
    });
};
