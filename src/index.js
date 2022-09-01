const { Client, Collection } = require("discord.js");
const { connect } = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: 3258319,
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
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

process.on("unhandledRejection", (error) =>
  console.error("[Unhandled promise rejection]:", error.message)
);

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(process.env.TOKEN);
(async () => {
  await connect(process.env.databaseTOKEN).catch((error) =>
    console.error(error)
  );
})();
