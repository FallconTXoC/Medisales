const fs = require(`fs`);
const path = require(`path`);
require(`dotenv`).config();

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.stack}`);
});

if (!fs.existsSync(path.join(__dirname, "data"))) fs.mkdirSync(path.join(__dirname, "data"));
if (!fs.existsSync(path.join(__dirname, "data/contracts"))) fs.mkdirSync(path.join(__dirname, "data/contracts"));

const ExpressLoader = require( "./loaders/express" );
new ExpressLoader();