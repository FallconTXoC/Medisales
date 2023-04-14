const LoginService = require('../services/LoginService');
const LoginServiceInstance = new LoginService();
let isSocketInitialized = false;

module.exports = { display };

async function display(req, res) {
    if(isSocketInitialized === false) {
        LoginServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/login.js",
        defer: true
    })
    res.render_data.content = "login.twig";
    res.render_data.disable = {
        navbar: true,
        notifications: true
    }
    res.render("main.twig", res.render_data);
}