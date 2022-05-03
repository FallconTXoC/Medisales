const ContractsService = require('../services/ContractsService');
const ContractsServiceInstance = new ContractsService();
let isSocketInitialized = false;

module.exports = { display, showContract };

async function display(req, res) {
    if(isSocketInitialized === false) {
        ContractsServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/contracts.js",
        defer: true
    })
    res.render_data.content = "contracts.twig";
    res.render_data.contracts = await ContractsServiceInstance.getContracts();

    res.render("main.twig", res.render_data);
}

async function showContract(req, res) {
    res.render_data.js_files.push({
        src: "/js/contract_page.js",
        defer: true
    })
    res.render_data.content = "contract_page.twig";
    res.render_data.contractInfo = await ContractsServiceInstance.getContractInfo(req.query.idcontract);

    res.render("main.twig", res.render_data);
}