const express = require(`express`);
const path = require(`path`);
const bodyparser = require(`body-parser`);
const uniqid = require(`uniqid`);
const helmet = require(`helmet`);
const cookieParser = require(`cookie-parser`);
const noCache = require(`nocache`);
const cors = require(`cors`);
const routes = require(`../routes`);
const socketHelper = require(`../utils/socket`);
const tokenHelper = require(`../utils/token`);
const User = require("../models/user");
require(`dotenv`).config();

class ExpressLoader {
    constructor() {
        const app = express();
        const server = require('http').createServer(app);
        const io = socketHelper.socket(server);

        app.use(cors());
        app.use(helmet({
            contentSecurityPolicy: false,
        }));
        app.use(bodyparser.urlencoded({
            extended: true
        }));
        app.use(cookieParser())
        app.use(bodyparser.json());
        app.use(noCache());
        app.set("twig options", {
            "allow_async": true,
            "autoescape": false,
            "cache": false,
            "strict_variables": false,
            "debug": false,
            "auto_reload": true,
        });
        app.set('views', path.join(path.dirname(__dirname), `public`, `views`));
        app.set('view engine', 'twig');
        app.set('view cache', false);
        app.use(express.static(path.join(path.dirname(__dirname), "public")));
        app.use(express.static(path.join(path.dirname(__dirname), "data")));

        app.use(async function (req, res, next) {
            res.render_data = {
                "js_files": [],
                "css_files": [],
                "title": "MEDISales",
                "description": "Gestion simplifiée des contrats médicaux.",
                "selected_menu": "store",
            }
            const token = req.cookies.token
            if (token) {
                const cookies_data = await tokenHelper.decryptToken(token);
                if (cookies_data.state) return next();
                const user = await new User(cookies_data.id_user).getUser();
                if (user.length < 1) return next();
                res.render_data.user = {
                    id: cookies_data.id_user,
                    name: user.Prenom + " " + user.Nom,
                };
            }
            next();
        })

        app.use((req, res, next) => {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const second = date.getSeconds();

            const hoursString = hours < 10 ? `0${hours}` : hours;
            const minutesString = minutes < 10 ? `0${minutes}` : minutes;
            const secondString = second < 10 ? `0${second}` : second;
            const dateString = `${hoursString}:${minutesString}:${secondString}`;

            console.log(`[ROUTER][${dateString}] ${req.method} ${req.url}`);
            next();
        });

        routes(app);

        app.get("/", function (req, res) {
            res.redirect("/store");
        });

        app.get("/logout", function (req, res) {
            res.clearCookie("token");
            res.redirect("/");
        });

        server.listen(process.env.PORT, () => {
            console.log(`[INFO] Server is running on port ${process.env.PORT}`);
        });
    }
}

module.exports = ExpressLoader;