const { Client, Collection, Partials } = require("discord.js");
const { connect } = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: 3258319,
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  allowedMentions: { repliedUser: true, parse: ["everyone", "roles", "users"] },
  rest: { timeout: 10000 },
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.stickyChannel = new Collection();
client.commandArray = [];

const functionsFolder = fs.readdirSync("./src/functions");
for (const folder of functionsFolder) {
  const functionsFile = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionsFile) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

(async () => {
  await client.handleEvents();

  await connect(process.env.databaseTOKEN).catch((error) =>
    console.error(error)
  );

  await client.handleCommands();
  await client.handleComponents();

  await client.login(process.env.TOKEN);
})();

(() => {})();
