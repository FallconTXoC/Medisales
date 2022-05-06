const StoreService = require('../services/StoreService');
const StoreServiceInstance = new StoreService();
let isSocketInitialized = false;

module.exports = { display, showProduct };

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
    res.render_data.products = await StoreServiceInstance.getProducts();

    res.render("main.twig", res.render_data);
}

async function showProduct(req, res) {
    res.render_data.js_files.push({
        src: "/js/product_page.js",
        defer: true
    })
    res.render_data.content = "product_page.twig";
    res.render_data.productInfo = await StoreServiceInstance.getProductInfo(req.query.idprod);

    res.render("main.twig", res.render_data);
}