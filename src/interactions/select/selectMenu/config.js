import { MessageFlags } from "discord.js";
import { handleSelectOptions } from "../selectOptions.handler.js";

export default {
  customId: "config",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    await handleSelectOptions(interaction, guildData, "config")
  },
};
