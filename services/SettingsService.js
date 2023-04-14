const socketHelper = require("../utils/socket");
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();
const User = require("../models/user");

class SettingsService {
    constructor() {}

    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSettings", async (data) => {
                io.emit("getSettings", await getSettings(data.id));
            });
        });
    }

    async applySettings(iduser, data) {
        // TODO : Filtrer les données
        const userInstance = new User(iduser);

        const result = userInstance.applySettings(data);

        return result ? true : {success: false, message: "Erreur interne"};
    }
}

module.exports = SettingsService;