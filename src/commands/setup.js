import {
  ChannelType,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import guildSchema from "../models/guild.model.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Sets up the bot configuration.")
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel where user open tickets.")
        .setRequired(true)
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */

  async execute(interaction) {
    const channel = interaction.options.getString("channel");
    if (!channel.startsWith("<#") || !channel.endsWith(">")) {
      return interaction.reply({
        content: "Please provide a valid channel mention.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }

    const channelId = channel.split("#")[1].slice(0, -1);

    if (!interaction.guild.channels.cache.has(channelId)) {
      return interaction.reply({
        content: "The specified channel does not exist in this server.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }

    try {
      const guildData = await guildSchema.findOne({
        guildId: interaction.guild.id,
      });

      // If guild data does not exist, create it
      if (!guildData) {
        new guildSchema({
          guildId: interaction.guild.id,
        }).save();

        return interaction.reply({
          content: "Guild data created successfully. Please try again.",
          flags: MessageFlags.Ephemeral, // Ephemeralal
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
            } catch (e) {}
          }
          // Update the ticket opening message in the database
          await guildSchema.updateOne(
            { guildId: interaction.guild.id },
            {
              ticketOpeningMessage: {
                ...guildData.ticketOpeningMessage,
                id: message.id,
              },
            }
          );
        });

      // Update the ticket channel ID
      await guildSchema.updateOne(
        { guildId: interaction.guild.id },
        { ticketOpeningChannelId: channelId }
      );

      // If guild data not have ticketCategoryId or does not exist in cache, create a new category
      if (
        !guildData.ticketCategoryId ||
        !interaction.guild.channels.cache.has(guildData.ticketCategoryId)
      ) {
        interaction.guild.channels
          .create({
            name: "tickets",
            type: ChannelType.GuildCategory,
          })
          .then(async (category) => {
            await guildSchema.updateOne(
              { guildId: interaction.guild.id },
              { ticketCategoryId: category.id }
            );
          });
      }
    } catch (error) {
      console.error("Error setting up the channel:", error);
      return interaction.reply({
        content: "An error occurred while setting up the channel.",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    }

    return interaction.reply({
      content: `The channel has been set to <#${channelId}>. Please use the \`/view\` command to see the current configuration.`,
      flags: MessageFlags.Ephemeral, // Ephemeral
    });
  },
};
