import { Client, Collection, GatewayIntentBits } from "discord.js";
import("colors"); // Colors for terminal output
import { config } from "dotenv";
import mongoose from "mongoose";

// Read environment variables from .env file
config();

// The bot token from environment variables
const token = process.env.TOKEN;

// Create a new Discord client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Log in to Discord with the bot token
client.login(token).catch((err) => {
  console.log(("Failed to log in: " + err.message).red);
});

// Commands handler
const commandsCollection = (client.commands = new Collection());
import commandHandler from "./handlers/commands.handler.js";
await commandHandler(commandsCollection, token);

// Events handler
import eventsHandler from "./handlers/events.handler.js";
await eventsHandler(client);

// DB connection
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully".green);
} catch (error) {
  console.log("Failed to connect to MongoDB: ".red + error.message);
}