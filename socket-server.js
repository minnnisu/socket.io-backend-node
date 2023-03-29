const express = require("express");
const app = express();
const port = 3001;
var http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // send text message
  socket.on("send message", (msg) => {
    console.log(`text message : (${msg.name}) ${msg.msg}`);
    io.emit("receive message", { name: msg.name, msg: msg.msg });
  });

  // send encrypted base64 file
  socket.on("sendBase64", (data) => {
    console.log(`base64 data : (${data.name}) ${data.base64Data}`);
    io.emit("receciveBase64", { name: data.name, base64Data: data.base64Data });
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

http.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
