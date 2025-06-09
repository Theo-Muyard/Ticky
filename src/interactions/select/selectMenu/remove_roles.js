import { MessageFlags } from "discord.js";
import guildSchema from "../../../models/guild.model.js";

export default {
  customId: "remove_role",
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
      // Remove the role from the allowed roles
      await guildSchema.updateOne(
        {
          guildId: interaction.guild.id,
        },
        {
          $pull: { allowedRoles: { $in: allRolesId } },
        }
      );

      if (
        guildData.ticketCategoryId &&
        interaction.guild.channels.cache.has(guildData.ticketCategoryId)
      ) {
        for (const roleId of allRolesId) {
          interaction.guild.channels.cache
            .get(guildData.ticketCategoryId)
            .permissionOverwrites.delete(roleId);

          interaction.guild.channels.cache
            .filter((c) => c.parentId === guildData.ticketCategoryId)
            .forEach((channel) => {
              channel.permissionOverwrites
                .delete(roleId)
                .catch((err) =>
                  console.error(
                    `Failed to remove permissions in channel ${channel.id}:`,
                    err
                  )
                );
            });
        }
      }
    } catch (error) {
      console.error("Error while remove new role:", error);
      return interaction.reply({
        content: "An error occurred remove new role.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }

    interaction.reply({
      content: `New(s) rôle(s) removed : ${allRolesId
        .map((role) => `<@&${role}>`)
        .join(", ")}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
