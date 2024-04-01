const { socketauth } = require('config/config');


let io = require("socket.io-client");
let socket = io.connect(socketauth.ip, {
    reconnect: true,
    transports: [ "websocket" ],
    auth: socketauth.auth
})

socket.on("connect", () => {
    console.log("Socket connected");
})

export default socket;