import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

import { REST, Routes } from "discord.js";

const commandHandler = async (commandsCollection, token) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const foldersPath = fs.readdirSync(path.join(__dirname, "..", "commands"));

  commandsCollection.clear();

  for (const folder of foldersPath) {
    const folderPath = path.join(__dirname, "..", "commands", folder)

    const commandsPath = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));
    
    
    for (const file of commandsPath) {
      const filePath = path.join(folderPath, file);
      const fileURL = pathToFileURL(filePath).href;
      const commandModule = await import(fileURL);
      const command = commandModule.default;

      if (!command.data || !command.execute) {
        console.log(
          "[WARNING] The command at ".yellow +
            `${filePath}`.red +
            " is missing a required 'data' or 'execute' property.".yellow
        );
      } else {
        commandsCollection.set(command.data.name, command);
      }
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(token);

  // And deploy your commands!
  (async () => {
    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        {
          body: [...commandsCollection.values()].map((command) =>
            command.data.toJSON()
          ),
        }
      );

      console.log(
        `Successfully reloaded ${
          data.length
        } application (/) commands.\nCommands : [${Array.from(
          commandsCollection.keys()
        ).join(", ")}]`.blue
      );
    } catch (error) {
      console.error(
        "There was an error while deploying application commands:".red,
        error
      );
    }
  })();
};

export default commandHandler;
