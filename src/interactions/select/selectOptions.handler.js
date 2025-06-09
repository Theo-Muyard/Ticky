import fs from "fs";
import path from "path";
import { MessageFlags } from "discord.js";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function handleSelectOptions(interaction, guildData, optionDir) {
  const value = interaction.values[0];
  try {
    const filesPath = path.join(__dirname, "..", "selectOptions", optionDir);
    const files = fs.readdirSync(filesPath);

    let found = false;

    for (const file of files) {
      if (found) return
      const optionPath = path.join(filesPath, file);
      const optionURL = pathToFileURL(optionPath).href;
      const imported = await import(optionURL);
      const optionModule = imported.default;

      if (!optionModule.value || !optionModule.execute) {
        console.log(
          "[WARNING] The selectOption at ".yellow +
            `${optionPath}`.red +
            " is missing a required 'value' or 'execute' property.".yellow
        );
        throw new Error("Missing options");
      } else if (optionModule.value === value) {
        await optionModule.execute(interaction, guildData);
        found = true
      }
    }
    if (!found) {
      await interaction.reply({
        content: "Option not implemented.",
        flags: MessageFlags.Ephemeral,
      });
    }
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "Option not implemented.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
