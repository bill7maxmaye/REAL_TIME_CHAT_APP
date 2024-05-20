const { model } = require("mongoose");
const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    //Query: It queries the ConversationModel to find all conversations where the current user is either the sender or the receiver.
    // if u see the conversation model(table) there are columns named receiver and sender which are buth of the type mongoose.Schema.ObjectId (in other words they store the user id)
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 }) //It sorts the conversations by the updatedAt field in      descending order (most recently updated (written to the db) comes first).

      //It populates the messages, sender, and receiver fields with actual data from their respective collections, replacing the IDs with the full documents.
      .populate("messages") //from message table
      .populate("sender") //from the user table
      .populate("receiver"); ///from the user table

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return preve + (curr?.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

module.exports = getConversation;
