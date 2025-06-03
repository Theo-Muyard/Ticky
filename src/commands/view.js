import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import guildSchema from "../models/guild.model.js";

export default {
  data: new SlashCommandBuilder()
    .setName("view")
    .setDescription("Views the current bot settings."),

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

      const categoryName =
        interaction.guild.channels.cache.get(guildData.ticketCategoryId)
          ?.name || null;
      
      const channelId = interaction.guild.channels.cache.get(
        guildData.ticketOpeningChannelId
      )?.id || null;

      //  The view embed
      const viewConfigEmbed = new EmbedBuilder()
        .setColor("#1f87c9")
        .setTitle("Server Configuration - Ticky Bot")
        .setURL("https://example.com")
        .setDescription(
          "*This is the current configuration, use `/setup` to change the settings*"
        )
        .addFields(
          { name: "\u200B", value: "" },
          {
            name: "OpenedChannel",
            value: guildData.ticketOpeningChannelId && channelId
              ? `<#${channelId}>`
              : "Not set",
            inline: true,
          },
          {
            name: "Category",
            value: guildData.ticketCategoryId && categoryName
              ? `[${categoryName}](https://example.com)`
              : "Not set",
            inline: true,
          },
          { name: "\u200B", value: "" }
        )
        .setTimestamp()
        .setFooter({
          text: "Thanks for using Ticky Bot!",
        });

      await interaction.reply({
        embeds: [viewConfigEmbed],
      });
    } catch (error) {
      console.error("Error fetching guild data:", error);
    }
  },
};
