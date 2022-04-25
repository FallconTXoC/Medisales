const app = require('./app');
const server = require('http').createServer(app);
const io = helper.socket(server);

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.stack}`);
});

app.use((req, res, next) => {
    // Create date DD/MM/YYYY HH:MM:SS
    const date = new Date();
    const hours = date.getHours() + 1;
    const minutes = date.getMinutes();
    const second = date.getSeconds();
    // Add minimum 2 digits
    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const secondString = second < 10 ? `0${second}` : second;
    const final = `${hoursString}:${minutesString}:${secondString}`;
    console.log(`[ROUTER][${final}] {${req.headers['x-forwarded-for']}} ${req.method} ${req.url}`);
    next();
});