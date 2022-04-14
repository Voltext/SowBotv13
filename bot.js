const { Client, Collection } = require("discord.js");
const client = new Client({ partials: ["CHANNEL"], intents: 32767});
require('dotenv').config();

client.commands = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();
client.voiceGenerator = new Collection();

require("./Handlers/Events")(client);
require("./Handlers/Commands")(client);
require("./Handlers/errorHandler.js")(client);

require("./Systems/FilterSys.js")(client);

client.login(process.env.BOT_TOKEN);