import { MessageFlags, ChannelType } from "discord.js";

export default {
  customId: "open_ticket",
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    // Open a ticket when the button is clicked
    try {
      // Check if the ticket category is set
      if (
        !guildData.ticketCategoryId ||
        !interaction.guild.channels.cache.has(guildData.ticketCategoryId)
      ) {
        return interaction.reply({
          content: "Ticket category not set up. Please contact an admin.",
          flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
        });
      }

      // Create a ticket channel
      const newTicketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: guildData.ticketCategoryId,
        lockPermissions: true,
      });

      await newTicketChannel.permissionOverwrites.edit(interaction.user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      await newTicketChannel.send({
        content: `Hello ${interaction.user}, your ticket has been created!`,
      });

      await interaction.reply({
        content: `Ticket created: <#${newTicketChannel.id}>`,
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }
  },
};
