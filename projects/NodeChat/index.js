"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const socketIO = require("socket.io");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const hash = require("crypto");
const io = socketIO.listen(server);
class User {
    constructor(uid, name) {
        this.uid = uid;
        this.name = name;
    }
}
const users = new Map();
const userData = new Map();
//test data : Username   id  hashed password (sha256)
userData.set(312, ["Matthias", "eabacc757e4c05b60f60e34ab4fb5aa6939f4dcb80700ce7cef84933ad3c86a3"]);
userData.set(123, ["Markus", "4e56932e19e333a10b3c5bf48265dd7b08e5465b6b01328c5345367ddd962ac4"]);
server.listen(process.env.PORT || 3000);
console.log("server listening on port " + server.address().port);
app.use("/client", express.static("client"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// route for Home-Page
app.get('/', (req, res) => {
    res.redirect("/login");
});
app.get("/login", (req, res) => {
    res.sendFile((__dirname + "/client/login.html"));
    console.log("new user redirected to login");
});
app.post("/login", (req, res) => {
    //Get transmitted data
    const username = req.body.username;
    const password = req.body.password;
    //Get uid
    let user = null;
    for (let entry of userData.entries()) {
        console.log(entry);
        if (entry[1][0] == username) {
            user = entry;
        }
    }
    if (user) {
        //user is known
        const hashedPW = hash.createHash('sha256').update(password).digest("hex");
        if (hashedPW === user[1][1]) {
            //login sucessfull
            console.log("correct: user " + username + " is logged in");
            users.set(uid, new User(uid, userData.get(uid)[0]));
            const token = jwt.sign({});
        }
    }
});
app.get("/redirects", (req, res) => {
    if (req.session.uid) {
        res.redirect("/chat");
    }
    else {
        console.log("error on login");
        res.redirect("/login?error=true");
    }
});
app.get("/chat", (req, res) => {
    const uid = req.session.uid;
    if (!uid) {
        return res.redirect("/redirects");
    }
    res.sendFile((__dirname + "/client/index.html"));
    //Get session uid
    //add user so socket can identify him
});
io.sockets.on("connection", (socket) => {
    console.log("new socket connection");
    let user;
    socket.once("login", (data) => {
        //get uid from session
        user = users.get(uid);
        user.socket = socket;
        console.log(uid + " connected | total usercount: " + users.size);
        socket.emit("accepted", { name: user.name, id: user.uid });
        //send message to all
        io.sockets.emit("user new", { name: user.name, id: user.uid });
    });
    //disconnect
    socket.on("disconnect", () => {
        if (user && user.uid) {
            users.delete(user.uid);
            console.log("Disconnected: %s sockets connected", users.size);
        }
    });
    socket.on("message", data => {
        console.log(user.name + ">>" + data);
        io.sockets.emit("message", { user: { name: user.name, id: user.uid }, msg: data });
    });
});
//# sourceMappingURL=index.js.map