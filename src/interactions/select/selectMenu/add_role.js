import { MessageFlags } from "discord.js";
import guildSchema from "../../../models/guild.model.js";

export default {
  customId: "add_role",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const allRolesId = interaction.values;

    try {
      // Add the role to the allowed roles
      await guildSchema.updateOne(
        {
          guildId: interaction.guild.id,
        },
        {
          $addToSet: { allowedRoles: [...allRolesId] },
        }
      );

      if (
        guildData.ticketCategoryId &&
        interaction.guild.channels.cache.has(guildData.ticketCategoryId)
      ) {
        for (const roleId of allRolesId) {
          interaction.guild.channels.cache
            .get(guildData.ticketCategoryId)
            .permissionOverwrites.edit(roleId, {
              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
            });

          interaction.guild.channels.cache
            .filter((c) => c.parentId === guildData.ticketCategoryId)
            .forEach((channel) => {
              channel.permissionOverwrites
                .edit(roleId, {
                  ViewChannel: true,
                  SendMessages: true,
                  ReadMessageHistory: true,
                })
                .catch((err) =>
                  console.error(
                    `Failed to add permissions in channel ${channel.id}:`,
                    err
                  )
                );
            });
        }
      }
    } catch (error) {
      console.error("Error while add new role:", error);
      return interaction.reply({
        content: "An error occurred add new role.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }

    interaction.reply({
      content: `New(s) rôle(s) added : ${allRolesId
        .map((role) => `<@&${role}>`)
        .join(", ")}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
