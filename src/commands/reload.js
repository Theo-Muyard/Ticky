import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";

config(); // Load environment variables from .env file

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads the bot commands.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription(
          "The command to reload (leave empty to reload all commands)"
        )
        .setRequired(true)
    ),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */
  async execute(interaction) {
    const commandName = interaction.options.getString("command");

    try {
      // Reload a specific command
      const commandPath = `../commands/${commandName}.js?update=${Date.now()}`;
      const newCommand = (await import(commandPath)).default;
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply({
        content: `Command \`${newCommand.data.name}\` has been reloaded.`,
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
    } catch (error) {
      await interaction.reply({
        content: "An error occurred while reloading command(s).",
        flags: MessageFlags.Ephemeral, // Ephemeral
      });
      console.error("Error reloading command(s):", error);
    }
  },
};
