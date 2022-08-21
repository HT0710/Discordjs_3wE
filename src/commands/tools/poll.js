const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { default: mongoose } = require("mongoose");
const Poll = require("../../schemas/poll");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll.")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Put a title for your poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("timer")
        .setDescription("Timer for your poll")
        .setRequired(true)
        .setChoices(
          { name: "10s", value: "10" },
          { name: "15s", value: "15" },
          { name: "30s", value: "30" },
          { name: "1m", value: "60" },
          { name: "5m", value: "300" },
          { name: "10m", value: "600" },
          { name: "30m", value: "1800" },
          { name: "1h", value: "3600" },
          { name: "12h", value: "43200" },
          { name: "1d", value: "86400" },
          { name: "1w", value: "604800" },
          { name: "forever", value: "forever" }
        )
    )
    .addStringOption((option) =>
      option.setName("description").setDescription("Description for your poll")
    ),
  async execute(interaction, client) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const timer = interaction.options.getString("timer");

    const poll = new Poll({
      _id: mongoose.Types.ObjectId(),
      guildId: interaction.guild.id,
      ownerId: interaction.member.id,
      title: title,
      description: description,
      timer: parseInt(timer) ? parseInt(timer) : null,
    });

    await poll.save().catch((e) => console.log(e.message));

    const modal = new ModalBuilder()
      .setCustomId("poll-submit")
      .setTitle("Options for your poll");

    for (let i = 1; i <= 5; i++) {
      modal.addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(i.toString())
            .setLabel("Choice " + i)
            .setRequired(i > 2 ? false : true)
            .setStyle(TextInputStyle.Short)
        )
      );
    }

    await interaction.showModal(modal);
  },
};