import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  allowedRoles: {
    type: [String],
    default: []
  },
  ticketOpeningChannelId: {
    type: String,
    default: null
  },
  ticketCategoryId: {
    type: String,
    default: null
  },
  ticketOpeningMessage: {
    type: Object,
    default: {
      content: null,
      id: null
    }
  },
  welcomeMessage: {
    type: String,
    default: "Welcome in this ticket! Please describe your issue and we will assist you shortly."
  }
})

const Guild = mongoose.model("Guild", guildSchema);
export default Guild;