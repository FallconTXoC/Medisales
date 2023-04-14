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

router.get('/store', middlewares["connections"].isConnected, cors(), store.display);
router.get('/store/product', middlewares["connections"].isConnected, cors(), store.showProduct);

module.exports = router;