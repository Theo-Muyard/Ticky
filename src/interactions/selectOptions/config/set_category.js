import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { configBackButton } from "../../../tools/apparence.js";

export default {
  value: "category",
  async execute(interaction, guildData) {
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const redEmoji = "<:red:1381307379940987001>"
    const greenEmoji = "<:green:1381307350744301658>"

    const categoryName =
      interaction.guild.channels.cache.get(guildData.ticketCategoryId)?.name ||
      null;

    const categoryView = categoryName ? `[${categoryName}](https://example.com)` : "Not set"
    
    // Buttons
    const editButton = new ButtonBuilder()
      .setCustomId("edit_category")
      .setLabel("Edit")
      .setStyle(ButtonStyle.Primary);
    
    const createButton = new ButtonBuilder()
      .setCustomId("create_category")
      .setLabel("Create for me")
      .setStyle(ButtonStyle.Primary);

    // Row
    const row = new ActionRowBuilder().addComponents(configBackButton, editButton, createButton);

    // Embed
    const setCategoryEmbed = new EmbedBuilder()
      .setColor("#3b8bc1")
      .setAuthor({
        name: `Welcome to the category pannel`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        `This is the category where ticket is created, you can use the buttons below to configure\n\n${
          categoryName ? greenEmoji : redEmoji
        } | **The actual category :** ${categoryView}\n\n`
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    await interaction.update({
      embeds: [setCategoryEmbed],
      components: [row],
    });
  },
};
