import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadSelects() {
  const selects = new Map();
  const fullPath = path.join(__dirname, "selectMenu")
  const files = fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const fileURL = pathToFileURL(path.join(fullPath, file)).href;
    const select = (await import(fileURL)).default;

    if (!select || !select.customId) {
      console.warn(
        `[WARNING] The select at ${file} is missing a 'customId' property or is empty.`
      );
      continue;
    }
    selects.set(select.customId, select);
  }
  return selects;
}
