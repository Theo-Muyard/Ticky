import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { configBackButton } from "../../../tools/apparence.js";

export default {
  value: "channel",
  async execute(interaction, guildData) {
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const redEmoji = "<:red:1381307379940987001>"
    const greenEmoji = "<:green:1381307350744301658>"

    const channelId =
      interaction.guild.channels.cache.get(guildData.ticketOpeningChannelId)
        ?.id || null;

    const channelView = channelId ? `<#${channelId}>` : "Not set"
    
    // Button
    const editButton = new ButtonBuilder()
      .setCustomId("edit_channel")
      .setLabel("Edit")
      .setStyle(ButtonStyle.Primary);

    // Row
    const row = new ActionRowBuilder().addComponents(configBackButton, editButton);

    // Embed
    const setChannelEmbed = new EmbedBuilder()
      .setColor("#3b8bc1")
      .setAuthor({
        name: `Welcome to the channel pannel`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        `This is the channel where users can opened a ticket, you can use the buttons below to configure\n\n${
          channelId ? greenEmoji : redEmoji
        } | **The actual channel :** ${channelView}\n\n`
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    await interaction.update({
      embeds: [setChannelEmbed],
      components: [row],
    });
  },
};
