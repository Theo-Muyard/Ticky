import { SlashCommandBuilder } from "discord.js";

export default {
  // Command name and description
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  /**
   * @param {import("discord.js").CommandInteraction} interaction 
   */

  // Command execution logic
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
