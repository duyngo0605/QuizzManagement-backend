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

     
      socket.join(conversation._id.toString());
      console.log(` User ${socket.id} joined conversation ${conversation._id}`);

     
      socket.emit("joinedConversation", { conversationId: conversation._id });
    } catch (error) {
      console.error(" Error joining conversation:", error);
    }
  });

  
  socket.on("sendMessage", async (message) => {
    const { senderId, content, receiverId } = message;

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

      // 💾 Lưu tin nhắn
      const savedMessage = await saveMessage(conversation._id, senderId, content, receiverId);
      console.log("📨 Message saved & emitted:", savedMessage._id);

      // 📡 Phát tin nhắn đến phòng
      io.to(conversation._id.toString()).emit("newMessage", savedMessage);
    } catch (error) {
      console.error(" Error saving message:", error);
    }
  });

 
  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});


