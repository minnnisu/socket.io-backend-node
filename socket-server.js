const express = require("express");
var ss = require("socket.io-stream");
var fs = require("fs");
const { Transform, Writable, Readable, Duplex } = require("stream");

const app = express();
const consumerSockets = [];
const port = 3001;
var http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // maxHttpBufferSize: 1e8,
});

io.on("connection", (socket) => {
  consumerSockets.push(socket);
  console.log("  consumerSockets.length: ", consumerSockets.length);

  // send text message
  socket.on("sendMsg", (msg) => {
    console.log(`text message : (${msg.name}) ${msg.msg}`);
    io.emit("receiveMsg", { name: msg.name, msg: msg.msg });
  });

  // ss(socket).on("sendImg", function (stream, size) {
  //   const newStream = ss.createStream();
  //   ss(socket).emit("receiveImg", newStream, size);
  //   stream.pipe(newStream);
  // });

  // receive the image
  ss(socket).on("sendImg", function (incomingStream, data) {
    console.log("on image ", data);

    for (var i in consumerSockets) {
      var consumerSocket = consumerSockets[i];
      var outgoingStream = ss.createStream();
      ss(consumerSocket).emit("receiveImg", outgoingStream, data);
      incomingStream.pipe(outgoingStream);
    }
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

http.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
