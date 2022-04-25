const fs = require(`fs`);
const express = require(`express`);
const path = require(`path`);
const bodyparser = require(`body-parser`);
const uniqid = require(`uniqid`);
const helmet = require(`helmet`);
const cookieParser = require(`cookie-parser`);
const noCache = require(`nocache`);
const cors = require(`cors`);
require(`dotenv`).config();

const app = express();
app.set("twig options", {
    "allow_async": true,
    "autoescape": false,
    "cache": false,
    "strict_variables": false,
    "debug": false,
    "auto_reload": true,
});
app.set('views', path.join(__dirname, `static`, `views`));
app.set('view engine', 'twig');
app.set('view cache', false);
app.use(cors());
app.use(helmet({contentSecurityPolicy: false,}));
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser())
app.use(bodyparser.json());
app.use(noCache());
app.use(fileUpload({createParentPath: true}));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "data")));

if (!fs.existsSync(path.join(__dirname, "data"))) fs.mkdirSync(path.join(__dirname, "data"));
if (!fs.existsSync(path.join(__dirname, "data/contracts"))) fs.mkdirSync(path.join(__dirname, "data/contracts"));

app.use(async function (req, res, next) {
    res.render_data = {
        "js_files": [],
        "css_files": [],
        "title": "MEDISales",
        "description": "Gestion simplifiée des contrats médicaux.",
        "selected_menu": "store",
    }
    if (req.url.includes("client")) return next();
    const token = req.cookies.token
    if (token) {
        const cookies_data = await helper.decryptToken(token);
        if (cookies_data.state) return next();
        const user = await helper.findUserById(cookies_data.id_user);
        if (!user) return next();
        res.render_data.user = user;
    }
    next();
})