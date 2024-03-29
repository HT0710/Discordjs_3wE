const chalk = require("chalk");
const { readdirSync } = require("fs");

module.exports = (client) => {
  client.handleComponents = async () => {
    const componentsFolder = readdirSync(`./src/components`);
    for (const folder of componentsFolder) {
      const componentFiles = readdirSync(`./src/components/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      const { buttons, selectMenus, modals } = client;

      switch (folder) {
        case "buttons": {
          for (const file of componentFiles) {
            const button = require(`../../components/${folder}/${file}`);
            if (button.data.name === "embedButtons") button.execute(buttons);
            else buttons.set(button.data.name, button);
          }
          break;
        }

        case "selectMenus": {
          for (const file of componentFiles) {
            const menu = require(`../../components/${folder}/${file}`);
            selectMenus.set(menu.data.name, menu);
          }
          break;
        }

        case "modals": {
          for (const file of componentFiles) {
            const modal = require(`../../components/${folder}/${file}`);
            if (modal.data.name === "embedModals") modal.execute(modals);
            else modals.set(modal.data.name, modal);
          }
          break;
        }

        case "pages": {
          const pageFolders = readdirSync(`./src/components/${folder}`);
          for (const pageTypeFolders of pageFolders) {
            const pageFiles = readdirSync(
              `./src/components/${folder}/${pageTypeFolders}`
            );
            for (const file of pageFiles) {
              const page = require(`../../components/${folder}/${pageTypeFolders}/${file}`);
              buttons.set(page.data.name, page);
            }
          }
          break;
        }

        default: {
          break;
        }
      }
    }

    console.log("[Component]:", chalk.green(`Ready`));
  };
};
