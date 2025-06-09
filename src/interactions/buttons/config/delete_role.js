import {
  MessageFlags,
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { configBackButton } from "../../../tools/apparence.js";

export default {
  customId: "remove_role",
  onlySender: true,
  async execute(interaction, guildData, page = 0) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const guildRoles = interaction.guild.roles.cache.filter(
      (role) =>
        !role.managed &&
        role.id !== interaction.guild.id &&
        guildData.allowedRoles.includes(role.id) &&
        !role.permissions.has("Administrator")
    );

    const allRoles = Array.from(guildRoles.values()).splice(0, 25);
    const options = allRoles.map((role) => ({
      label: role.name,
      value: role.id,
    }));

    // Select Menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("remove_role")
      .setPlaceholder("Select the roles to be removed")
      .addOptions(options)
      .setMinValues(1)
      .setMaxValues(options.length);

    // Embed
    const addRoleEmbed = new EmbedBuilder()
      .setColor("#3b8bc1")
      .setAuthor({
        name: `Welcome to the remove role pannel`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        allRoles.length > 0
          ? `Select all the roles to which you wish to remove access to the ticket category.`
          : "No roles to be removed..."
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    // Row
    const selectRow = new ActionRowBuilder().addComponents(menu);

    const buttonsRow = new ActionRowBuilder().addComponents(configBackButton);

    // Back config
    await interaction.update({
      embeds: [addRoleEmbed],
      components: [options.length > 0 ? selectRow : null, buttonsRow].filter(
        Boolean
      ),
    });
  },
};
