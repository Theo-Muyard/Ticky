import { Events } from "discord.js";
import guildModel from "../models/guild.model.js";

export default {
  name: Events.GuildDelete,
  once: false,

  /**
   * @param {import('discord.js').Guild} guild
   */

  async execute(guild) {
    try {
      const existingGuild = await guildModel.findOne({ guildId: guild.id });

      if (existingGuild) {
        await guildModel.deleteOne({ guildId: guild.id });

        console.log(`[-] New guild removed: ${guild.name} (${guild.id})`.green);
      }
    } catch (error) {
      console.log(`Error removed a guild: ${error.message}`.red);
      console.error(error);
    }
  },
};
