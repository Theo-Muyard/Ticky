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
  customId: "add_role",
  onlySender: true,
  async execute(interaction, guildData, page=0) {
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
        !guildData.allowedRoles.includes(role.id) &&
        !role.permissions.has("Administrator")
    );

    const allRoles = Array.from(guildRoles.values());
    const nbrMenu = Math.ceil(allRoles.length / 25);

    function getRoleOptions(roles, page, pageSize=25) {
      const start = page * pageSize;
      const end = start + pageSize;

      return roles.slice(start, end).map((role) => ({
        label: role.name,
        value: role.id,
      }));
    }

    const options = await getRoleOptions(allRoles, page)

    // Select Menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId("add_role")
      .setPlaceholder("Select the roles to be added")
      .addOptions(options)
      .setMinValues(1)
      .setMaxValues(options.length);

    // Embed
    const addRoleEmbed = new EmbedBuilder()
      .setColor("#3b8bc1")
      .setAuthor({
        name: `Welcome to the add role pannel - Page ${ nbrMenu > 0 ? page+1 : "0"}/${nbrMenu}`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        nbrMenu > 0
          ? `Select all the roles to which you wish to add access to the ticket category.`
          : "No roles to be added..."
      )
      .setTimestamp()
      .setFooter({
        text: "Thanks for using Ticky Bot!",
      });

    // Buttons
    const nextButton = new ButtonBuilder()
      .setCustomId(`add_role_next:${page}`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page >= nbrMenu - 1);

    const previousButton = new ButtonBuilder()
      .setCustomId(`add_role_prev:${page}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page < 1);

    // Row
    const selectRow = new ActionRowBuilder().addComponents(menu);

    const buttonsRow = new ActionRowBuilder().addComponents(configBackButton, previousButton, nextButton);

    // Back config
    await interaction.update({
      embeds: [addRoleEmbed],
      components: [options.length > 0 ? selectRow : null, buttonsRow].filter(
        Boolean
      ),
    });
  },
};
