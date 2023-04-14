const StoreService = require('../services/StoreService');
const StoreServiceInstance = new StoreService();
let isSocketInitialized = false;

module.exports = { display, showProduct, getProduct };

async function display(req, res) {
    if(isSocketInitialized === false) {
        StoreServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/store.js",
        defer: true,
        type: "module"
    })
    res.render_data.css_files.push(
        {
            src: "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
        },
        {
            src: "https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css"
        }
    )
    res.render_data.content = "store.twig";
    res.render_data.selected_menu = "store";
    
    res.render_data.products = await StoreServiceInstance.getProducts();
    res.render_data.filters = await StoreServiceInstance.getFilters();
    res.render_data.enable = { selector: true };

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

async function getProduct(req, res) {
    const result = await StoreServiceInstance.getProduct(req.params.id);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, product: result})
        : res.status(400).json({success: false, message: "Produit introuvable"});
}