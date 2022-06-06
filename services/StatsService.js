const socketHelper = require("../utils/socket");
const fns = require('date-fns');

const Contracts = require("../models/contract");
const ContractsInstance = new Contracts();

const User = require("../models/user");

class StatsService {
    constructor() {
    }

    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {

        });
    }

    async getWeekContracts(userID) {
        const curr = new Date;
        const day = curr;
        const firstday = fns.startOfWeek(day, {weekStartsOn: 1});
        const lastday = fns.endOfWeek(day, {weekStartsOn: 1});

        return await ContractsInstance.getContractsByDate(userID, firstday, lastday);
    }

    async getMemberContracts(memberID) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return await ContractsInstance.getContractsByDate(memberID, firstDay, lastDay);
    }

    async getTeamMembers(userID) {
        const user = await new User(userID).getUser();

        return await user.getTeamMembers(user.equipe);
    }

    async getWeekGoal(userID) {
        const curr = new Date;
        const day = curr;
        const firstday = fns.startOfWeek(day, {weekStartsOn: 1});
        const lastday = fns.endOfWeek(day, {weekStartsOn: 1});

        let goal = await new User(userID).getGoal(firstday, lastday);
        if(goal === null || goal === undefined) goal = 0;

        return goal;
    }
}

module.exports = StatsService;