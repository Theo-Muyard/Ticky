import { Events, ChannelType, MessageFlags} from "discord.js";
import guildSchema from "../models/guild.model.js";


export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {

    // Open a ticket when the button is clicked
    try {
      // Fetch guild data from the database
      const guildData = await guildSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!guildData) return;

      if (interaction.isButton() && interaction.customId === "open_ticket") {
        // Create a ticket channel
        const newTicketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: guildData.ticketCategoryId,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: ["ViewChannel"],
            },
            {
              id: interaction.user.id,
              allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            },
          ],
        })

        await newTicketChannel.send({
          content: `Hello ${interaction.user}, your ticket has been created!`,
        });

        await interaction.reply({
          content: `Ticket created: <#${newTicketChannel.id}>`,
          flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
        });
      }
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      })
    }

    // Command interaction handling
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return console.log(
        `[WARNING] No command matching ${interaction.commandName} was found.`
          .yellow
      );
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
        });
      }
    }
  },
};
