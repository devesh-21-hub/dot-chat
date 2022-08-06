require("dotenv").config();
const { createServer } = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const socketio = require("socket.io");
const cors = require("cors");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./src/utils/users");

const Filter = require("bad-words");

const app = express();

//const { Server } = require("socket.io");
//const io = new Server(httpServer);

const httpServer = createServer(app);

//Handeling CORS for socket.io
const io = socketio(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//app.options("*", cors());

//app.use(cors());
const {
  generateMessage,
  generateLocationMessage,
} = require("./src/utils/messages");

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.join("21");
  socket.emit(
    "message",
    "Id: " + socket.id,
    "Time: " + socket.handshake.time,
    "Hello from socket"
  );

  //io.in("21").emit();

  //callback() is the function passed to client side of input emit function

  socket.on("join", ({ username, userRoom }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room: userRoom,
    });

    if (error) {
      return callback(error);
    }
    //Join a room
    socket.join(user.room);

    socket.broadcast
      .to(user.room)
      .emit("userconnection", generateMessage(`${user.username} has joined`));

    //Send the list of connected users to the client who has joined, this will update automatically whenever someone joins or leaves
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback(null);
  });

  socket.on("input", (inputData, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter(inputData);

    if (filter.isProfane(inputData.meSSage))
      return callback(
        "Your message was not sent, as profanity is not allowed!",
        undefined
      );

    //user.room

    io.to(inputData.room).emit(
      "input-message",
      inputData,
      generateMessage("").createdAt
    );

    callback(undefined, "Message received");

    console.log("Message received");
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "message",
      `https://google.com/maps?q=${coords.latitude}${coords.longitude}`
    );

    //"Location received" is passed as the value of acknowledgement to the client
    callback("Location received");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log("user disconnected");
      // socket.broadcast.emit(
      //   "userconnection",
      //   generateMessage(user.username + " has leaved")
      // );

      socket.broadcast
        .to(user.room)
        .emit("userconnection", generateMessage(`${user.username} leaved`));

      //Send the list of connected users to the users in the room from which the current user has leaved
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

httpServer.listen(port, () => {
  console.log("Server listening on port " + port);
});
