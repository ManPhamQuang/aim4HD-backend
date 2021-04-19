//socket-singletion.js
const socket = require("socket.io");

var SocketSingleton = (function () {
    this.io = null;
    this.configure = function (server) {
        this.io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
    };

    return this;
})();

module.exports = SocketSingleton;
