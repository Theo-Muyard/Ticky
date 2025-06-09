import { Events, MessageFlags } from "discord.js";
import { loadButtons } from "../../interactions/buttons/buttons.index.js";
import { loadSelects } from "../../interactions/select/select.index.js";
import { loadModals } from "../../interactions/modals/modals.index.js";
import guildSchema from "../../models/guild.model.js";

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    try {
      // Fetch guild data from the database
      const guildData = await guildSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!guildData) {
        await new guildSchema({
          guildId: interaction.guild.id,
        }).save();
      }

      // Handler buttons
      if (interaction.isButton()) {

        if (
          interaction.customId.startsWith("add_role_next:") ||
          interaction.customId.startsWith("add_role_prev:")
        ) {
          const [action, page] = interaction.customId.split(":");
          let actualPage = parseInt(page, 10);

          if (action === "add_role_next") actualPage++;
          if (action === "add_role_prev") actualPage--;

          const addRolePagination = (await import("../../interactions/buttons/config/add_role.js")).default;
          await addRolePagination.execute(
            interaction,
            guildData ? guildData : null,
            actualPage
          )
          return;
        }

        const buttons = await loadButtons();
        const button = buttons.get(interaction.customId);
        if (button) {
          if (
            button.onlySender &&
            interaction.user.id !== interaction.message?.interaction.user.id
          ) {
            return interaction.reply({
              content: "Only the user who sent the order can interact with.",
              flags: MessageFlags.Ephemeral,
            });
          }
          
          return button.execute(interaction, guildData ? guildData : null);
        }
      }

      // Handler modals
      if (interaction.isModalSubmit()) {
        const modals = await loadModals();
        const modal = modals.get(interaction.customId);
        if (modal) {
          return modal.execute(interaction, guildData ? guildData : null);
        }
      }

      // Handler selects
      if (interaction.isStringSelectMenu()) {
        const selects = await loadSelects();
        const select = selects.get(interaction.customId);
        if (select) {
          if (
            select.onlySender &&
            interaction.user.id !== interaction.message?.interaction.user.id
          ) {
            return interaction.reply({
              content: "Only the user who sent the order can interact with.",
              flags: MessageFlags.Ephemeral,
            });
          }
          return select.execute(interaction, guildData ? guildData : null);
        }
      }
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: "An error occurred while processing your request.",
        flags: MessageFlags.Ephemeral, // Discord's "ephemeral" flag
      });
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
