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

  socket.on("sendImageInit", (header, data) => {
    console.log(`sendImageInit: ${{ ...header }}`);
    io.emit("receiveImageData", header, data);
  });

  socket.on("sendImageData", (header, data) => {
    console.log(`sendImageData`);
    io.to(header.recieverSocketID).emit("receiveImageData", header, data);
  });

  socket.on("moreData", (header) => {
    console.log(`moreData: ${{ ...header }}`);
    io.to(header.recieverSocketID).emit("requestMoreImageData", header);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

http.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
