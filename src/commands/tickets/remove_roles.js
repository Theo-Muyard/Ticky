import { SlashCommandBuilder, MessageFlags } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("remove_roles")
    .setDescription("Remove all roles"),

  /**
   * @param {import("discord.js").CommandInteraction} interaction
   */

  async execute(interaction) {
    const rolesToDelete = interaction.guild.roles.cache.filter(
      (role) => role.name === "nouveau rôle" && role.editable
    );

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });


    let deleted = 0;
    for (const role of rolesToDelete.values()) {
      try {
        await role.delete("Suppression automatique");
        deleted++;
      } catch (error) {}
    }

    await interaction.editReply({
      content: `🗑️ \`${deleted}\` rôle(s) nommé(s) "nouveau role" supprimé(s).`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
