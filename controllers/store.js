const StoreService = require('../services/StoreService');
const StoreServiceInstance = new StoreService();
let isSocketInitialized = false;

module.exports = { display };

async function display(req, res) {
    if(isSocketInitialized === false) {
        StoreServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/store.js",
        defer: true
    })
    res.render_data.content = "store.twig";
    res.render("main.twig", res.render_data);
}