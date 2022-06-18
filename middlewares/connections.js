const tokenHelper = require("../utils/token");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
    isConnected: async function(req, res, next){
        const connected = await new Promise(async (resolve) => {
            const token = req.cookies.token
            if(token) {
                const user = await tokenHelper.decryptToken(token);
                if(!user.id_user) return resolve(false);
                const userConnected = await new User(user.id_user).userExists();
                if(userConnected === true) {
                    jwt.verify(token, process.env.JWT_SECRET,{}, (err) => {
                        if(!err) resolve(true);
                        else resolve(false);
                    });
                } else {
                    resolve(false);
                    res.clearCookie("token");
                }
            } else resolve(false);
        });
        if(connected === true) return next();
        else return res.redirect("/login");
    }
} 