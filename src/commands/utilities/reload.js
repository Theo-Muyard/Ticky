import { error } from "console";
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const commandsDir = path.join(__dirname, "..", "..", "commands")

    const commandName = interaction.options.getString("command");

    function findCommandFile(dir, commandName) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          const found = findCommandFile(fullPath, commandName)
          if (found) return found;
        } else if (file === `${commandName}.js`) {
          return fullPath
        }
      }
      return null;
    }

    try {
      // Reload a specific command
      const commandFound = findCommandFile(commandsDir, commandName);
      if (!commandFound) throw new Error("Not found");
      const commandURL = pathToFileURL(commandFound).href + `?update=${Date.now()}`
      const newCommand = (await import(commandURL)).default;
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
