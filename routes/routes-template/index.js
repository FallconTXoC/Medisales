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

router.get('/store', function (req, res) {
    console.log("hello")
});

module.exports = router;