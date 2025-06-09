import {
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export function getConfigApparence(interaction) {

  //  The view embed
  const viewConfigEmbed = new EmbedBuilder()
    .setColor("#3b8bc1")
    .setAuthor({
      name: "Welcome to the server configuration pannel",
      iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setDescription(
      `This is the configuration editor, which lets you modify the basic system. For more customization, go to the [dashboard](https://google.com)\n\n**All links:** [Website](https://google.com) | [Vote](https://google.com) | [Support](https://google.com)`
    )
    .setTimestamp()
    .setFooter({
      text: "Thanks for using Ticky Bot!",
    });

  const settingsMenu = new StringSelectMenuBuilder()
    .setCustomId("config")
    .setPlaceholder("Select to change pannel view")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Channel")
        .setDescription("The channel where users can open a ticket")
        .setValue("channel"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Category")
        .setDescription("The category where tickets are added")
        .setValue("category"),

      new StringSelectMenuOptionBuilder()
        .setLabel("Roles")
        .setDescription("The roles that can view tickets")
        .setValue("roles")
    );

  // The row
  const row = new ActionRowBuilder().addComponents(settingsMenu);

  return {
    viewConfigEmbed,
    row,
  };
}

export const configBackButton = new ButtonBuilder()
  .setCustomId("config_back")
  .setLabel("Back")
  .setStyle(ButtonStyle.Secondary);
