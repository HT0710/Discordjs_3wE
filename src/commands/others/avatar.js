const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get the avatar of the selected.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("member")
        .setDescription("Show member profile avatar.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Tag a target to steal there avatar.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("myself").setDescription("Show myself profile avatar.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("guild").setDescription("Show guild profile avatar.")
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "member": {
        const target = interaction.options.getUser("target");
        if (!target)
          return await interaction.reply({
            content: "Need a target to steal there avatar.",
            ephemeral: true,
          });
        return await interaction.reply(
          target.displayAvatarURL({
            dynamic: true,
            extension: "png",
            size: 4096,
          })
        );
      }

      case "guild": {
        try {
          return await interaction.reply(
            interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
              size: 4096,
            })
          );
        } catch {
          return await interaction.reply({
            content: "I don't think this guild has a avatar.",
            ephemeral: true,
          });
        }
      }

      default: {
        return await interaction.reply(
          interaction.user.displayAvatarURL({
            dynamic: true,
            extension: "png",
            size: 4096,
          })
        );
      }
    }
  },
};