import { MessageFlags, ChannelType } from "discord.js";
import guildSchema from "../../../models/guild.model.js";

export default {
  customId: "create_category",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    if (
      !guildData.ticketCategoryId ||
      !interaction.guild.channels.cache.has(guildData.ticketCategoryId)
    ) {
      const permissionOverwrites = [
        {
          id: interaction.guild.roles.everyone.id,
          deny: ["ViewChannel"],
        },
        ...guildData.allowedRoles.map((role) => ({
          id: role,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        })),
      ];

      interaction.guild.channels
        .create({
          name: "tickets",
          type: ChannelType.GuildCategory,
          permissionOverwrites,
        })
        .then(async (category) => {
          await guildSchema.updateOne(
            { guildId: interaction.guild.id },
            { ticketCategoryId: category.id }
          );

          return interaction.reply({
            content: "The category has been correctly create.",
            flags: MessageFlags.Ephemeral, // Ephemeral
          });
        })
        .catch((error) => {
          console.error("Error while create new category:", error);
          return interaction.reply({
            content: "An error occurred while create new category.",
            flags: MessageFlags.Ephemeral, // Ephemeral
          });
        });
    } else {
      return interaction.reply({
        content: "The category has already set, i can't create a new.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }
  },
};
