const socketHelper = require("../utils/socket");
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();
const User = require("../models/user");
const securityUtils = require("../utils/security");

class SettingsService {
    constructor() {}

    /**
     * Initialize sockets for the current instance.
     */
    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSettings", async (data) => {
                io.emit("getSettings", await getSettings(data.id));
            });
        });
    }

    /**
     * Under construction
     */
    async applySettings(iduser, data) {
        // TODO : Filtrer les données
        const id_user = securityUtils.escapeHtml(iduser);

        const userInstance = new User(id_user);
        const result = userInstance.applySettings(data);

        return result ? true : {success: false, message: "Erreur interne"};
    }
}

module.exports = SettingsService;