const SettingsService = require('../services/SettingsService');
const SettingsServiceInstance = new SettingsService();
let isSocketInitialized = false;

module.exports = { display, applySettings };

async function display(req, res) {
    if(isSocketInitialized === false) {
        SettingsServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/settings.js",
        defer: true
    })
    res.render_data.content = "settings.twig";
    
    res.render("main.twig", res.render_data);
}

async function applySettings(req, res) {
    // TODO : Récupérer l'id de l'utilisateur depuis le token

    const result = SettingsServiceInstance.applySettings("", req.body);

    return (result === true) ? res.status(200).json({success: true}) : res.status(400).json({success: false, message: result.message});
}