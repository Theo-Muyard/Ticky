import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const eventsHandler = async (client) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const eventsFoldersPath = fs.readdirSync(
    path.join(__dirname, "..", "events")
  );

  const events = [];

  for (const folder of eventsFoldersPath) {
    const eventsFolderPath = path.join(__dirname, "..", "events", folder);
    const eventsFiles = fs
      .readdirSync(eventsFolderPath)
      .filter((file) => file.endsWith(".js"));
    
    for (const file of eventsFiles) {
      const filePath = path.join(eventsFolderPath, file);
      try {
        const fileURL = pathToFileURL(filePath).href;
        const eventModule = await import(fileURL);
        const event = eventModule.default;

        if (!event.name || !event.execute) {
          console.log(
            "[WARNING] The event at ".yellow +
              `${filePath}`.red +
              " is missing a required 'name' or 'execute' property.".yellow
          );
        } else {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
          } else {
            client.on(event.name, (...args) => event.execute(...args));
          }
          events.push(event.name);
        }
      } catch (err) {
        console.log(`[ERROR] Failed to load event at ${filePath}:`, err);
      }
      
    }
  }
  console.log(`Events : [${events.join(", ")}]`);
};

export default eventsHandler;
