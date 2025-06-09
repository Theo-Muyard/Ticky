import {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { configBackButton } from "../../../tools/apparence.js";

export default {
  value: "roles",
  async execute(interaction, guildData) {
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const redEmoji = "<:red:1381307379940987001>";
    const greenEmoji = "<:green:1381307350744301658>";

    const validRoles = guildData.allowedRoles.filter((role) =>
      interaction.guild.roles.cache.has(role)
    ).map(role => `<@&${role}>`)

    const rolesView = validRoles.length > 0 ? validRoles.join(", ") : "Not set";

    // Button
    const addRole = new ButtonBuilder()
      .setCustomId("add_role")
      .setLabel("Add")
      .setStyle(ButtonStyle.Success);

    const deleteRole = new ButtonBuilder()
      .setCustomId("remove_role")
      .setLabel("Remove")
      .setStyle(ButtonStyle.Danger);

    // Row
    const row = new ActionRowBuilder().addComponents(configBackButton, addRole, deleteRole);

    // Embed
    const setRolesEmbed = new EmbedBuilder()
      .setColor("#3b8bc1")
      .setAuthor({
        name: `Welcome to the roles pannel`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        `These are the roles that can view tickets opened by users.\n\n${
          validRoles.length > 0 ? greenEmoji : redEmoji
        } | **The roles :** ${rolesView}\n\n`
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    await interaction.update({
      embeds: [setRolesEmbed],
      components: [row],
    });
  },
};
