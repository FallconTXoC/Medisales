const express = require('express');
const router = express.Router();

let middlewares = {};
middlewares[`connections`] = require("./middlewares/connections");

const contracts = require("./controllers/contracts");
const login = require("./controllers/login");
const settings = require("./controllers/settings");
const stats = require("./controllers/stats");
const store = require("./controllers/store");

router.all('/', (req, res) => {
    res.send({
        message: 'Hello from Express!'
    });
});

module.exports = router;