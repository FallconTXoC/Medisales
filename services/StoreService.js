const socketHelper = require("../utils/socket");

class StoreService {
    constructor() {
    }

    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {

        });
    }
}

module.exports = StoreService;