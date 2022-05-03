const socketHelper = require("../utils/socket");
const Contracts = require("../models/contract");
const ContractsInstance = new Contracts();
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();

class ContractsService {
    constructor() {
    }

    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSortedContracts", async (data) => {
                io.emit("getSortedContracts", await getSortedContracts(data));
            });
        });
    }

    async getContracts() {
        return await ContractsInstance.getContracts();
    }

    async getSortedContracts(data) {
        const symptomes = data.symptomes ?? [];
        const principesActifs = data.principesActifs ?? [];
        const maladies = data.maladies ?? [];
        const forme = data.forme ?? [];
        const voieAdmin = data.voieAdmin ?? [];

        const tablesData = {
            mainTable: {
                name: "Contrat",
                propertyCode: "ID"
            },
            criterias: {
                Date: {
                    name: "Contrat",
                    keyword: "c",
                    propertyCode: "Date",
                    values: dates,
                    isInternal: true
                },
                Client: {
                    name: "Contrat",
                    keyword: "c",
                    propertyCode: "CodeClient",
                    values: clients,
                    isInternal: true
                },
                Produit: {
                    name: "Contrat",
                    keyword: "c",
                    propertyCode: "CodeProd",
                    values: clients,
                    isInternal: true
                },
            }
        }

        return await ContractsInstance.sortContracts(tablesData);
    }

    async getContractInfo(idprod) {
        return await ContractsInstance.findByID(idprod)
    }
}

module.exports = ContractsService;