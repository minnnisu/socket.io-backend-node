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
  socket.on("send message", (item) => {
    console.log(`${item.name} : ${item.msg}`);
    io.emit("receive message", { name: item.name, msg: item.msg }); //"receive message"라는 이벤트 발생
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
  });
});

http.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
