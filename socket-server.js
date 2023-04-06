const express = require("express");
var ss = require("socket.io-stream");
var fs = require("fs");
const { Transform, Writable, Readable, Duplex } = require("stream");

const app = express();
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
  // send text message
  socket.on("send message", (msg) => {
    console.log(`text message : (${msg.name}) ${msg.msg}`);
    io.emit("receive message", { name: msg.name, msg: msg.msg });
  });

  // socket.on("send", (data) => {
  //   console.log(data);
  //   io.emit("receive", data);
  // });

  ss(socket).on("file", function (stream, size) {
    const tempStream = ss.createStream();
    console.log(stream);
    stream.pipe(tempStream);
    ss(socket).emit("receive", tempStream, size);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

http.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
