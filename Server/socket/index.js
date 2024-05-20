const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helpers/getConversation");

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

/***
 * socket running at http://localhost:5000/
 */

//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("Connected User ", socket.id);
  //below we access a piece of data(specifically in this case the token) that was sent by the client during the initial handshake process of establishing a WebSocket connection using socket.io

  const token = socket.handshake.auth.token;

  // On the client side, when initiating the connection,
  //the client includes the authentication token like this:
  //in the connection request it included in auth property. look Home.jsx when the app first mounts inside the useEeffect

  // const socketConnection = io('http://yourserver.com', {
  //   auth: {
  //     token: localStorage.getItem("token"),
  //   },
  // });

  //current user details
  const user = await getUserDetailsFromToken(token);

  //create a room

  // The room is specific to each user and is identified by the user's unique ID. This allows the server to target messages to a particular user, regardless of how many devices or connections (sockets) they have. Each socket (representing a connection from a device) joins the same room for that user, enabling consistent and unified communication across all of the user’s active connections.

  // This line makes the connected client join a specific room associated with the user's ID. In socket.io, rooms are used to group sockets that should receive the same messages.(sockets created by joining the same user from different devices or tabs) By joining a room named after the user's ID, you can easily send messages to that specific user later.
  if (user && user._id) {
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());

    //Inform other clients or relevant parties that this user is now online by emitting an event
    //broadcasts an event named "onlineUser" to all connected clients, sending an array of user IDs that represent the currently online users. This allows all clients to stay updated on the list of users who are online.
    //Array.from(onlineUser) converts the onlineUser set into an array.
    //onlineUser is a Set containing the user IDs of all users currently online
    //io refers to the main socket.io server instance.
    //The emit method sends an event to all connected clients.

    io.emit("onlineUser", Array.from(onlineUser));

    //the socket prifix implies for each socket connection to the server
    //socket.on ======= means listen to an event from the client with specific custom name
    //socket.emit ====== means emit an event to the client with specific name

    socket.on("message-page", async (userId) => {
      console.log("userId", userId);
      const userDetails = await UserModel.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit("message-user", payload);

      //get previous message
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });

    //new message
    socket.on("new message", async (data) => {
      //check conversation is available both user

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      //if conversation is not available
      if (!conversation) {
        const createConversation = await ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });
      const saveMessage = await message.save();

      const updateConversation = await ConversationModel.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: saveMessage?._id },
        }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit(
        "message",
        getConversationMessage?.messages || []
      );
      io.to(data?.receiver).emit(
        "message",
        getConversationMessage?.messages || []
      );

      //send conversation
      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit("conversation", conversationSender);
      io.to(data?.receiver).emit("conversation", conversationReceiver);
    });

    //sidebar
    //when the sidebar firstime mounts, it emit an event named "sidebar" with the user id as a payload to this listner. this listner will get conversation with this given user id and emits it to the client specifically to the conversation listner

    socket.on("sidebar", async (currentUserId) => {
      console.log("current user", currentUserId);

      const conversation = await getConversation(currentUserId);
      //when the sidebar firstime mounts this event ("conversation event") is emitted to the client at the same time it listen to it. what this does is

      socket.emit("conversation", conversation);
    });

    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];

      const updateMessages = await MessageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      //send conversation
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });

    //disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user?._id?.toString());
      console.log("User Disconnected ", socket.id);
    });
  }
});

module.exports = {
  app,
  server,
};
