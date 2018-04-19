console.log("Started Server");
var express = require("express");
var app = express();
var http = require("http").Server(app);
let io = require("socket.io")(http);
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/client/login/index.html");
});



app.use("/client", express.static(__dirname + "/client"));
http.listen(2000);

io.on("connection", function(socket) {
    console.log("Possible player connected...")
});
