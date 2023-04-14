const { Server } = require("socket.io");
let io;

module.exports = {
    /**
     * Creates a new server.
     * @param {*} server http server, port, or options
     * @returns {Server} io
     */
    socket: function (server) {
        io = new Server(server);
        return io;
    },
    /**
     * Returns all existing server instances.
     * @returns {Server} io
     */
    getSockets: function () {
        return io;
    },
}