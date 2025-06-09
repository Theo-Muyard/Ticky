import { SlashCommandBuilder } from "discord.js";
import guildSchema from "../../models/guild.model.js";
import { getConfigApparence } from "../../tools/apparence.js";

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Views and edit the current bot settings."),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */

  async execute(interaction) {
    try {
      const guildData = await guildSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!guildData) {
        return interaction.reply("The guild data does not exist.");
      }

      const { viewConfigEmbed, row } = getConfigApparence(interaction)

      await interaction.reply({
        embeds: [viewConfigEmbed],
        components: [row],
      });
    } catch (error) {
      console.error("Error fetching guild data:", error);
    }
  },
};
