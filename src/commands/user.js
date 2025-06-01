import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get information about a user"),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.reply(`This command is used by ${interaction.user.username}, joined on ${interaction.member.joinedAt}.`)
  },
};