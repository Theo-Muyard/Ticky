import { MessageFlags } from "discord.js";
import { getConfigApparence } from "../../../tools/apparence.js";

export default {
  customId: "config_back",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const { row, viewConfigEmbed } = getConfigApparence(interaction);

    // Back config
    await interaction.update({
      embeds: [viewConfigEmbed],
      components: [row],
    });
  },
};
