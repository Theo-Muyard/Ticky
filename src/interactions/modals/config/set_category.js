import {
  ChannelType,
  MessageFlags,
} from "discord.js";
import guildSchema from "../../../models/guild.model.js";

export default {
  customId: "set_category",
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const categoryId = interaction.fields.getTextInputValue("input_category");
    const category = interaction.guild.channels.cache.get(categoryId);

    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.reply({
        content:
          "The specified category does not exist in this server or is not a category.",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Channel already set as ticket opening channel
    if (guildData.ticketCategoryId === categoryId) {
      return interaction.reply({
        content: "This category is already set as the ticket category.",
        flags: MessageFlags.Ephemeral, // Ephemeralal
      });
    }

    try {
      await guildSchema.updateOne(
        { guildId: interaction.guild.id },
        { ticketCategoryId: categoryId }
      );

      interaction.reply({
        content: `The category has been set to **\`${
          interaction.guild.channels.cache.get(categoryId).name
        }\`** (${categoryId})`,
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    } catch (error) {
      console.error("Error while setup new category:", error);
      return interaction.reply({
        content: "An error occurred while setup new category.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }
  },
};
