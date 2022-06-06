const express = require('express');
const router = express.Router();
const cors = require(`cors`);

let middlewares = {};
middlewares[`connections`] = require("../../middlewares/connections");

const contracts = require("../../controllers/contracts");
const login = require("../../controllers/login");
const settings = require("../../controllers/settings");
const stats = require("../../controllers/stats");
const store = require("../../controllers/store");

router.get('/login', cors(), login.display);


//router.get('/settings', middlewares["connections"].isConnected, cors(), settings.display);
//router.post('/settings/save', middlewares["connections"].isConnected, cors(), settings.applySettings);


router.get('/store', middlewares["connections"].isConnected, cors(), store.display);
router.get('/store/product/:id', middlewares["connections"].isConnected, cors(), store.showProduct);
router.get('/store/getProduct/:id', middlewares["connections"].isConnected, cors(), store.getProduct);


router.get('/contracts', middlewares["connections"].isConnected, cors(), contracts.display);
router.get('/contracts/getContracts', middlewares["connections"].isConnected, cors(), contracts.getContracts);
router.get('/contracts/contract/:id', middlewares["connections"].isConnected, cors(), contracts.showContract);
router.get('/contracts/getClients', middlewares["connections"].isConnected, cors(), contracts.getClients);
router.get('/contracts/getClient/:id', middlewares["connections"].isConnected, cors(), contracts.getClient);
router.post('/contracts/save', middlewares["connections"].isConnected, cors(), contracts.saveContract);
router.post('/contracts/update', middlewares["connections"].isConnected, cors(), contracts.updateContract);
router.post('/contracts/delete', middlewares["connections"].isConnected, cors(), contracts.deleteContract);


//router.get('/statistics', middlewares["connections"].isConnected, cors(), stats.display);

module.exports = router;