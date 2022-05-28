const ContractsService = require('../services/ContractsService');
const ContractsServiceInstance = new ContractsService();
const tokenHelper = require(`../utils/token`);
let isSocketInitialized = false;

module.exports = { display, showContract, saveContract, updateContract, deleteContract, getClients };

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

async function getClients(req, res) {
    const result = await ContractsServiceInstance.getClients();
    console.log(result);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, clients: result})
        : res.status(400).json({success: false, error: result.message});
}

async function saveContract(req, res) {
    const cookies_data = await tokenHelper.decryptToken(req.cookies.token);

    const data = {
        ...req.body,
        userID: cookies_data.id_user
    }
    const result = await ContractsServiceInstance.saveContract(data);
    console.log(result)

    return (result === true)
        ? res.status(200).json({success: true})
        : res.status(400).json({success: false, error: result.message});
}

async function updateContract(req, res) {
    const result = await ContractsServiceInstance.updateContract(req.body);

    return (result === true)
        ? res.status(200).json({success: true})
        : res.status(400).json({success: false, error: result.message});
}

async function deleteContract(req, res) {
    const result = await ContractsServiceInstance.deleteContract(req.body.id);

    return (result === true)
        ? res.status(200).json({success: true})
        : res.status(400).json({success: false, error: result.message});
}