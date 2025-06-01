import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const eventsHandler = async (client) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const eventsPath = path.join(__dirname, "..", "events");
  const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

  for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
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
    }
  }
};

export default eventsHandler;