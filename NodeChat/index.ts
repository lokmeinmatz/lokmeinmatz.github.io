import { Http2Server } from "http2";
import { request } from "http";

const express = require("express")
const app = express()
const server : Http2Server = require("http").createServer(app)
const socketIO = require("socket.io")

//init express session so socket io can use it
const sessions = require("express-session")({
    secret: "sdgjisdjkghsdghsdlghsdgsdlgbsldhflsgj",
    resave: false,
    saveUninitialized: true
})
const bodyParser = require("body-parser")
const hash = require("crypto");
const sioExpress = require("express-socket.io-session")
const io = socketIO.listen(server)



class User {
    public socket: SocketIO.Socket
    public name: string
    public uid: number
    constructor(uid, name) {
        this.uid = uid
        this.name = name
    }
}



const users : Map<number, User> = new Map()

const userData : Map<number, [string, string]> = new Map()
//test data : Username   id  hashed password (sha256)
userData.set(312, ["Matthias", "eabacc757e4c05b60f60e34ab4fb5aa6939f4dcb80700ce7cef84933ad3c86a3"])
userData.set(123, ["Markus", "4e56932e19e333a10b3c5bf48265dd7b08e5465b6b01328c5345367ddd962ac4"])

server.listen(process.env.PORT || 3000)
console.log("server listening on port "+server.address().port)
app.use("/client", express.static("client"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessions )

io.use(sioExpress(sessions, {
    autoSave:true
})); 

// route for Home-Page
app.get('/', (req, res) => {
    res.redirect("/login")
});

app.get("/login", (req, res) => {
    res.sendFile((__dirname + "/client/login.html"))
    console.log("new user redirected to login")
})

app.post("/login", (req, res) => {
    
    //Get transmitted data
    const username = req.body.username
    const password = req.body.password

    
    //Get uid
    let user = null
    for(let entry of userData.entries()) {
        console.log(entry)
        if(entry[1][0] == username) {
            user = entry
        }
    }
    
    if(user) {
        //user is known
        const hashedPW = hash.createHash('sha256').update(password).digest("hex")
        
        if(hashedPW === user[1][1]) {
            //login sucessfull
            console.log("correct: user "+username+" is logged in")
            req.session.uid = user[0]
            
        }
        else {
        }
    }
    res.redirect("/redirects")

    
})

app.get("/redirects", (req, res) => {
    if(req.session.uid) {
        res.redirect("/chat")
    }
    else {
        console.log("error on login")
        res.redirect("/login?error=true")
    }
})
app.get("/chat", (req, res) => {
    const uid = req.session.uid
    if(!uid) {
        return res.redirect("/redirects")
    }
    res.sendFile((__dirname + "/client/index.html"))
    //Get session uid
    users.set(uid, new User(uid, userData.get(uid)[0]))
    //add user so socket can identify him
})


io.sockets.on("connection", (socket : SocketIO.Socket) => {
    
    console.log("new socket connection")
    
    let user : User
    socket.once("login", (data) => {
        //get uid from session
        const uid = socket.handshake.session.uid
        user = users.get(uid)
        user.socket = socket
        console.log(uid+" connected | total usercount: "+users.size)
        socket.emit("accepted", {name:user.name, id:user.uid})

        //send message to all
        io.sockets.emit("user new", {name:user.name, id:user.uid})
    })


    

    //disconnect
    socket.on("disconnect", () => {
        if(user && user.uid) {
            users.delete(user.uid)
            console.log("Disconnected: %s sockets connected", users.size)
        }
    })

    socket.on("message", data => {
        console.log(user.name+">>"+data)
        io.sockets.emit("message", {user:{name:user.name, id:user.uid} ,msg:data})
    })
})