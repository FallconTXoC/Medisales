let io;

module.exports = {
    socket: function (server) {
        io = new Server(server);
        return io;
    },
    getSockets: function () {
        return io;
    },
}