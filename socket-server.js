const express = require("express");
const ss = require("socket.io-stream");

const app = express();
const port = 3001;
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // maxHttpBufferSize: 1e8,
});

io.on("connection", (socket) => {
  // send text message
  socket.on("sendMsg", (msg) => {
    console.log(`text message : (${msg.name}) ${msg.msg}`);
    io.emit("receiveMsg", { name: msg.name, msg: msg.msg });
  });

  // receive the image
  ss(socket).on("sendImg", async function (incomingStream, data) {
    const sockets = await io.of("/").fetchSockets(); // return all Socket instances
    for (const _socket of sockets) {
      console.log(_socket.id);
      const outgoingStream = ss.createStream();
      ss(_socket).emit("receiveImg", outgoingStream, data);
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
