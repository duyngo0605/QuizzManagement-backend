const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Conversation = require("./models/Conversation");
const { saveMessage } = require("./services/MessageService");
const { log } = require("console");
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

routes(app);
const server = http.createServer(app);
app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(`${process.env.BACKEND_ENDPOINT}`,)
  .then(() => {
    console.log("Connect Db success!" + `${process.env.BACKEND_ENDPOINT}`);
  })
  .catch((err) => {
    console.log(err);
  });
server.listen(port, () => {
  console.log("Server is running in port: ", +port);
});




//io



const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for security)
  },
});

io.on("connection", (socket) => {
  console.log("🔗 New user connected:", socket.id);


  socket.on("joinConversation", async ({ senderId, receiverId }) => {
    log(" Joining conversation:", senderId, receiverId);
    try {
      log(" Joining conversation:", senderId, receiverId);
      let conversation = await Conversation.findOne({
        $or: [
          { user1: senderId, user2: receiverId },
          { user1: receiverId, user2: senderId },
        ],
      });

     
      if (!conversation) {
        conversation = new Conversation({ user1: senderId, user2: receiverId });
        await conversation.save();
      }

     
      socket.join(conversation._id.toString());
      console.log(` User ${socket.id} joined conversation ${conversation._id}`);

     
      socket.emit("joinedConversation", { conversationId: conversation._id });
    } catch (error) {
      console.error(" Error joining conversation:", error);
    }
  });
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(` User ${socket.id} joined user room ${userId}`);
  });
  
  socket.on("sendMessage", async (message) => {
    const { senderId, content, receiverId,type } = message;
  
    if (!senderId || !content || !receiverId) {
      console.error(" Missing required fields in sendMessage:", message);
      return;
    }

    try {
     
      let conversation = await Conversation.findOne({
        $or: [
          { user1: senderId, user2: receiverId },
          { user1: receiverId, user2: senderId },
        ],
      });

      if (!conversation) {
        conversation = new Conversation({ user1: senderId, user2: receiverId });
        await conversation.save();
      }

     
      const savedMessage = await saveMessage(conversation._id, senderId, content, receiverId,type);
    
      
      io.to(conversation._id.toString()).emit("newMessage", savedMessage);

      const updatedConversation = await Conversation.findById(conversation._id)
    .populate("user1", "email avatar")
    .populate("user2", "email avatar")
    .populate({
      path: "lastMessage.messageId",
      select: "content sentAt",
    })
    .populate({
      path: "lastMessage.senderId",
      select: "_id",
    });
    const formatConversation = (conv, userId) => {
    
      const otherUser = conv.user1._id.toString() === userId ? conv.user2 : conv.user1;
    
      return {
        conversationId: conv._id.toString(),
        user: {
          id: otherUser._id.toString(),
          email: otherUser.email,
          avatar: otherUser.avatar || ""
        },
        lastMessage: conv.lastMessage
        ? {
          content: conv.lastMessage.messageId?.content
          ? type === "image" ? "🖼️ Picture" : conv.lastMessage.messageId.content
          : "",
            senderId: conv.lastMessage.senderId?._id || "",
            sentAt: conv.lastMessage.messageId?.sentAt || "",
          }
        : null,
  
        createdAt: conv.createdAt.toISOString()
      };
    };
    
    io.to(senderId).emit("updateConversationList", formatConversation(updatedConversation, senderId));
    io.to(receiverId).emit("updateConversationList", formatConversation(updatedConversation, receiverId));
    } catch (error) {
      console.error(" Error saving message:", error);
    }
  });

 
  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});

