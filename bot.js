const { Client, Collection } = require("discord.js");
const client = new Client({ partials: ["CHANNEL", "MESSAGE"], intents: 98303});
require('dotenv').config();
const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client);

client.commands = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();
client.voiceGenerator = new Collection();
client.textGenerator = new Collection();

require("./Handlers/Events")(client);
require("./Handlers/Commands")(client);
require("./Handlers/errorHandler.js")(client);

require("./Systems/FilterSys.js")(client);

client.login(process.env.BOT_TOKEN);