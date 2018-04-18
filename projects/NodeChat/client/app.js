$(document).ready(() => {
    socket = io.connect();
    socket.emit("login");
    socket.on("accepted", data => {
        me = new CUser(data.name, data.id);
        console.log(me);
        displayServerMsg("Wilkommen im Chat " + me.name);
    });
    socket.on("user new", data => {
        if (data.id != me.id) {
            displayServerMsg("Neuer User: " + data.name);
        }
    });
    socket.on("message", data => {
        if (data.user.id != me.id) {
            messages.push(new ScreenMessage(new CUser(data.user.name, data.user.id), data.msg));
        }
    });
    DOMfeed = $("main");
    $("#input-form").submit((e) => {
        e.preventDefault();
        sendMessage();
        $("#message-input").val("");
    });
});
class CUser {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
let me = new CUser("Matthias", "");
const messages = [];
let socket;
let DOMfeed;
class ScreenMessage {
    constructor(sender, msg) {
        this.sender = sender;
        this.msg = msg;
        if (sender == me) {
            this.DOMelmt = $("<div class='message me'>");
        }
        else {
            this.DOMelmt = $("<div class='message'>");
        }
        //Set name and time
        this.DOMelmt.append($("<h3>" + sender.name + "  <span>" + new Date().toLocaleTimeString("de-DE").substr(0, 5) + "</span></h3>"));
        //Set message
        this.DOMelmt.append($("<p>" + msg + "</p>"));
        DOMfeed.append(this.DOMelmt);
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }
}
function displayServerMsg(msg) {
    const dom = $("<div class='server-msg'><p>" + msg + "</p></div>");
    DOMfeed.append(dom);
}
function sendMessage() {
    const msgin = $("#message-input");
    const msg = msgin.val();
    if (msg.toString().length > 0) {
        console.log("sending " + msg);
        //send and write to screen
        messages.push(new ScreenMessage(me, msg));
        socket.send(msg);
    }
}
//# sourceMappingURL=app.js.map