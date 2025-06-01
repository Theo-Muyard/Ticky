import { Events } from "discord.js";
import guildModel from "../models/guild.model.js";

export default {
  name: Events.GuildCreate,
  once: false,

  /**
   * @param {import('discord.js').Guild} guild
   */

  async execute(guild) {
    try {

      const existingGuild = await guildModel.findOne({ guildId: guild.id });

      if (existingGuild) return

      await new guildModel({
        guildId: guild.id,
      }).save();
      console.log(`[+] New guild added: ${guild.name} (${guild.id})`.green);
    } catch (error) {
      console.log(`Error adding new guild: ${error.message}`.red);
      console.error(error);
    }
  },
};
