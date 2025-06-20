import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadModals() {
  const modals = new Map();

  async function loadDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        await loadDir(fullPath);
      } else if (file.endsWith(".js") && file !== "modals.index.js") {
        const fileURL = pathToFileURL(fullPath).href;
        const button = (await import(fileURL)).default;
        if (button && button.customId) {
          modals.set(button.customId, button);
        }
      }
    }
  }

  await loadDir(__dirname);
  return modals;
}
