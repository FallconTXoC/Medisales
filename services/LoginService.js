const socketHelper = require("../utils/socket");
const tokenHelper = require(`../utils/token`);
const bcrypt = require('bcrypt');
const User = require("../models/user");
const securityUtils = require("../utils/security");

class LoginService {
    constructor() {
    }

    /**
     * Initialize sockets for the current instance.
     */
    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("signin", async (data) => {
                const {username, password} = data;
                const user = new User(securityUtils.escapeHtml(username));
                const userPass = await user.userExists() ? await user.getUserPass() : false;
                const {lastname, firstname} = userPass ? await user.getNames() : {lastname: "", firstname: ""};

                if(userPass === false) io.emit(`signin`, {success: false, message: "Utilisateur inexistant"});
                else {
                    bcrypt.compare(password, userPass, async function(err, result) {   
                        if(err) throw err;
                        else {
                            if(result) {
                                const tokenCookie = await tokenHelper.createToken({
                                    id_user: username,
                                    firstname: firstname,
                                    lastname: lastname,
                                });
                                io.emit(`signin`, {success: true, token: tokenCookie});
                            } else io.emit(`signin`, {success: false, message: "Mauvais identifiants"});
                        }
                    });
                }
            });
        });
    }
}

module.exports = LoginService;