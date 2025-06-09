import {
  MessageFlags,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
} from "discord.js";
import guildSchema from "../../../models/guild.model.js";

export default {
  customId: "set_channel",
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const channelId = interaction.fields.getTextInputValue("input_channel");
    const channel = interaction.guild.channels.cache.get(channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        content:
          "The specified channel does not exist in this server or is not a text channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Channel already set as ticket opening channel
    if (guildData.ticketOpeningChannelId === channelId) {
      return interaction.reply({
        content: "This channel is already set as the ticket opening channel.",
        flags: MessageFlags.Ephemeral, // Ephemeralal
      });
    }

    // Create the message with the button on the ticket opening channel
    const openTicketEmbed = new EmbedBuilder()
      .setColor("#1f87c9")
      .setTitle("Open a Ticket - Ticky Bot")
      .setURL("https://example.com")
      .setDescription(
        `*Click on the button bellow to create a ticket*\n\n${
          guildData.ticketOpeningMessage?.content
            ? guildData.ticketOpeningMessage.content
            : ""
        }`
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    const ticketButton = new ButtonBuilder()
      .setCustomId("open_ticket")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(ticketButton);

    const ticketChannel = interaction.guild.channels.cache.get(channelId);

    await ticketChannel
      .send({
        embeds: [openTicketEmbed],
        components: [row],
      })
      .then(async (message) => {
        try {
          if (
            guildData.ticketOpeningChannelId &&
            guildData.ticketOpeningMessage.id
          ) {
            // If there is an existing ticket opening message, delete it
            try {
              const existingMessage = await interaction.guild.channels.cache
                .get(guildData.ticketOpeningChannelId)
                .messages.fetch(guildData.ticketOpeningMessage.id);

              if (existingMessage) {
                await existingMessage.delete();
              }
            } catch (e) {
              console.error("Error while setup new channel:", error);
              return interaction.reply({
                content: "An error occurred while setup new channel.",
                flags: MessageFlags.Ephemeral, // Ephemeral
              });
            }
          }

          // Update the ticket opening message in the database
          await guildSchema.updateOne(
            { guildId: interaction.guild.id },
            {
              ticketOpeningChannelId: channelId,
              ticketOpeningMessage: {
                ...guildData.ticketOpeningMessage,
                id: message.id,
              },
            }
          );

          interaction.reply({
            content: `The channel has been set to <#${channelId}>`,
            flags: MessageFlags.Ephemeral, // Ephemeral
          });
        } catch (error) {
          console.error("Error while setup new channel:", error);
          return interaction.reply({
            content: "An error occurred while setup new channel.",
            flags: MessageFlags.Ephemeral, // Ephemeral
          });
        }
      });
  },
};
