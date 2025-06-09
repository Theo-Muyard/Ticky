import { MessageFlags,ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export default {
  customId: "edit_category",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const categoryModal = new ModalBuilder()
      .setCustomId("set_category")
      .setTitle("Set new category");

    const newCategoryInput = new TextInputBuilder()
      .setCustomId("input_category")
      .setLabel("Enter the new category")
      .setPlaceholder("Enter the id of the category (Ex: 1366050813713190923)")
      .setStyle(TextInputStyle.Short);

    const modalRow = new ActionRowBuilder().addComponents(newCategoryInput);

    categoryModal.addComponents(modalRow);

    await interaction.showModal(categoryModal);
  },
};
