const StatsService = require('../services/StatsService');
const StatsServiceInstance = new StatsService();
const tokenHelper = require(`../utils/token`);
let isSocketInitialized = false;

module.exports = { display, getWeekContracts, getMemberMonthContractsNbr, getTeamMembers, getWeekGoal };

async function display(req, res) {
    if(isSocketInitialized === false) {
        StatsServiceInstance.initSocket();
        isSocketInitialized = true;
    };

    res.render_data.js_files.push({
        src: "/js/stats.js",
        defer: true,
        type: "module"
    })
    res.render_data.content = "stats.twig";
    res.render_data.selected_menu = "stats";

    res.render_data.objectif = {
        libelle: "Signer 40 contrats"
    }

    res.render("main.twig", res.render_data);
}

async function getWeekContracts(req, res) {
    const cookies_data = await tokenHelper.decryptToken(req.cookies.token);
    const userID = cookies_data.id_user;

    let result;
    if(req.query.id !== null && req.query.id !== undefined) result = await StatsServiceInstance.getWeekContracts(req.query.id);
    else result = await StatsServiceInstance.getWeekContracts(userID);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, contracts: result})
        : res.status(400).json({success: false, error: result.message});
}

async function getMemberMonthContractsNbr(req, res) {
    const memberID = req.query.id;

    const result = await StatsServiceInstance.getMemberContracts(memberID);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, contractsNbr: Object.keys(result).length})
        : res.status(400).json({success: false, error: result.message});
}

async function getTeamMembers(req, res) {
    const cookies_data = await tokenHelper.decryptToken(req.cookies.token);
    const userID = cookies_data.id_user;

    const result = await StatsServiceInstance.getTeamMembers(userID);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, team: result})
        : res.status(400).json({success: false, error: result.message});
}

async function getWeekGoal(req, res) {
    const cookies_data = await tokenHelper.decryptToken(req.cookies.token);
    const userID = cookies_data.id_user;

    const result = await StatsServiceInstance.getWeekGoal(userID);

    return (result !== null && result !== undefined)
        ? res.status(200).json({success: true, goal: result})
        : res.status(400).json({success: false, error: result.message});
}