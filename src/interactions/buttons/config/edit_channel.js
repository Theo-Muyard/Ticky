import { MessageFlags,ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export default {
  customId: "edit_channel",
  onlySender: true,
  async execute(interaction, guildData) {
    // No guilddata
    if (!guildData) {
      return interaction.reply({
        content: "No guild data. Please contact an admin.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
    }

    const channelModal = new ModalBuilder()
      .setCustomId("set_channel")
      .setTitle("Set new channel");

    const newChannelInput = new TextInputBuilder()
      .setCustomId("input_channel")
      .setLabel("Enter the new channel")
      .setPlaceholder("Enter the id of the channel (Ex: 1366050813713190923)")
      .setStyle(TextInputStyle.Short);

    const modalRow = new ActionRowBuilder().addComponents(newChannelInput);

    channelModal.addComponents(modalRow);

    await interaction.showModal(channelModal);
  },
};
