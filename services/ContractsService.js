const socketHelper = require("../utils/socket");
const Contracts = require("../models/contract");
const ContractsInstance = new Contracts();
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();
const Client = require("../models/client");
const ClientInstance = new Client();

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
        const dates = data.dates ?? [];
        const clients = data.clients ?? [];
        const produits = data.produits ?? [];

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
                    values: produits,
                    isInternal: true
                },
            }
        }

        return await ContractsInstance.sortContracts(tablesData);
    }

    async getContractInfo(idprod) {
        return await ContractsInstance.findByID(idprod)
    }

    async saveContract(data) {
        //TODO : Générer un uid + traiter les données

        const client = await ClientInstance.findByName(data.clientName);
        data["clientID"] = client ? client.CodeClient : ""; // TODO : générer un uid
        
        const result = await ContractsInstance.saveContract(data);

        return result ? true : {success: false, message: "Erreur interne"};
    }

    async updateContract(data) {
        //TODO : traiter les données

        const result = await ContractsInstance.updateContract(data);

        return result ? true : {success: false, message: "Erreur interne"};
    }

    async deleteContract(id) {
        let result;
        if(await ContractsInstance.contractExists(id) === true) result = await ContractsInstance.deleteContract(id);
        else return {success: false, message: "Le contrat n'existe pas"};

        return result ? true : {success: false, message: "Erreur interne"};
    }
}

module.exports = ContractsService;