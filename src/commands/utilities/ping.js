import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.reply("Pong!");
  },
  
};