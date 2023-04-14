const socketHelper = require("../utils/socket");
const securityUtils = require("../utils/security");
const fns = require('date-fns');
const uid = require('uniqid');

const Contracts = require("../models/contract");
const ContractsInstance = new Contracts();

const Client = require("../models/client");
const ClientInstance = new Client();

const regex = securityUtils.regex();

class ContractsService {
    constructor() {
    }

    /**
     * Initialize sockets for the current instance.
     */
    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSortedContracts", async (data) => {
                io.emit("getSortedContracts", await getSortedContracts(data));
            });
        });
    }

    /**
     * Retrieves all contracts in the database.
     * 
     * @returns {object} contracts
     */
    async getContracts() {
        return await ContractsInstance.getContracts();
    }

    /**
     * Retrieves all contracts of the specified user.
     * 
     * @param {string} userID 
     * @returns {object} contracts
     */
    async getUserContracts(userID) {
        return await ContractsInstance.getUserContracts(userID);
    }

    /**
     * Retrieves all clients in the database.
     * @returns {object} clients
     */
    async getClients() {
        return await ClientInstance.getClients();
    }

    /**
     * Retrieves client by its ID and returns true if getData = false
     * or an object with the client's data otherwise.
     * 
     * @param {string} id 
     * @param {bool} getData 
     * @returns Object or bool
     */
    async getClientByID(id, getData) {
        return await ClientInstance.findByID(id, getData);
    }

    /**
     * Retrieves all contracts of the specified user.
     * 
     * @param {string} userID 
     * @returns {object} contracts
     */
    async getUserContracts(userID) {
        return await ContractsInstance.getContractsByUserID(userID);
    }

    /**
     * Creates an object containing the necessary information for the
     * sorting based on received data and following the data pattern explained
     * in the sortObjects function of common queries.
     * 
     * @param {object} data [dates, clients, produits]
     * @returns {object} sorted contracts
     */
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

    /**
     * Retrieves all information of the specified contract.
     * 
     * @param {string} idContract 
     * @returns {object} contract data
     */
    async getContractInfo(idContract) {
        return await ContractsInstance.findByID(idContract)
    }

    /**
     * Creates a contract after validating the client's information
     * Returns object with error message on invalid data
     * 
     * @param {object} data
     * @return Object or true
     */
    async saveContract(data) {
        const contractID = uid();

        const productID = securityUtils.validateString(data.product.prodID, regex.idRegex);
        if(productID === false) return {success: false, message: "Mauvais ID de produit"};
        
        const qtt = parseInt(data.product.qtt);
        if(!(Number.isInteger(qtt) && qtt > 0)) return {success: false, message: "Mauvaise quantité"};

        const duree = parseInt(data.product.duree);
        if(!(Number.isInteger(qtt) && qtt > 0)) return {success: false, message: "Mauvaise durée"};
        const contractDateFin = fns.add(new Date(), {months: duree});

        const frequency = parseInt(data.product.frequency);
        if(!(Number.isInteger(frequency) && frequency > 0)) return {success: false, message: "Mauvaise fréquence de livraison"};

        let clientID;
        const saveResult = await this.saveClient(data.client);
        if(typeof saveResult === 'object') return saveResult;
        else clientID = saveResult;
        
        const contractData = [ contractID, clientID, productID, data.userID, new Date(), qtt, contractDateFin, frequency ]
        console.log(contractData)
        const result = await ContractsInstance.saveContract(contractData);

        return result ? true : {success: false, message: "Erreur interne"};
    }

    /**
     * Updates existing contract after validating data
     * Returns object with error message on invalid data
     * 
     * @param {object} data 
     * @returns Object or true
     */
    async updateContract(data) {
        const contractID = securityUtils.validateString(data.id, regex.idRegex);
        if(contractID === false || await ContractsInstance.contractExists(contractID) === false) return {success: false, message: "Mauvais ID de contrat"};

        const contract = await ContractsInstance.findByID(contractID);

        let qtt = parseInt(data.qtt);
        if(data.qtt === '') qtt = contract.QTT;
        else if(!(Number.isInteger(qtt) && qtt > 0)) 
            return {success: false, message: "Mauvaise quantité"};

        let contractDateFin = new Date(data.dateFin);
        if(data.dateFin === '') contractDateFin = contract.DateFin;
        else if(Object.prototype.toString.call(contractDateFin) !== '[object Date]')
            return {success: false, message: "Mauvaise date de fin de contrat"};

        let frequency = parseInt(data.frequency);
        if(data.frequency === '') frequency = contract.Frequence;
        else if(!(Number.isInteger(frequency) && frequency > 0)) 
            return {success: false, message: "Mauvaise fréquence de livraison"};

        const contractData = {
            id: contractID,
            qtt: qtt,
            dateFin: contractDateFin,
            frequency: frequency
        }
        
        const result = await ContractsInstance.updateContract(contractData);

        return result ? true : {success: false, message: "Erreur interne"};
    }


    /**
     * Deletes a contract after validating data
     * Returns object with error message on invalid data
     * 
     * @param {string} id 
     * @returns Object or true
     */
    async deleteContract(id) {
        let result;
        if(await ContractsInstance.contractExists(id) !== false) result = await ContractsInstance.deleteContract(id);
        else return {success: false, message: "Le contrat n'existe pas"};

        return result ? true : {success: false, message: "Erreur interne"};
    }

    /**
     * Deletes multiple contracts after validating data
     * Returns object with error message on invalid data
     * 
     * @param {object} contracts 
     * @returns Object or true
     */
    async deleteContracts(contracts) {
        let result;

        for(let contract in contracts) {
            let contractID = contracts[contract].contractID;
            if(await ContractsInstance.contractExists(contractID) !== false) result = await ContractsInstance.deleteContract(contractID);
            else return {success: false, message: "Le contrat n'existe pas"};

            if(!result) return {success: false, message: "Erreur interne"};
        }

        return result ? true : {success: false, message: "Erreur interne"};
    }

    /**
     * Checks if the client exists by the presence of "exists" bool in clientData
     * and its ID, if exists = false saves client data after validation, else
     * checks the database and return object with error message if he doesn't exist.
     * 
     * Returns object with error message on invalid data
     * 
     * @param {object} clientData 
     * @returns {string} clientID
     */
    async saveClient(clientData) {
        let clientID;
        if(clientData.exists === 'true') {
            clientID = securityUtils.validateString(clientData.idclient, regex.idRegex);
            if(clientID === false || await ClientInstance.findByID(clientID, false) !== true) 
                return {success:false, message: "Mauvais ID client"};

            return clientID;
        }
        else clientID = uid();

        const clientName = securityUtils.validateString(clientData.clientName, regex.stdStrRegex);
        if(clientName === false) return {success:false, message: "Mauvais nom de client"};

        const clientType = securityUtils.validateString(clientData.type, regex.stdStrRegex);
        if(clientType === false) return {success:false, message: "Mauvais type de client"};

        const clientMail = securityUtils.validateString(clientData.mail, regex.mailRegex);
        if(clientMail === false) return {success:false, message: "Mauvaise adresse mail cliente"};

        const clientAddress = securityUtils.validateString(clientData.address, regex.postalAddressRegex);
        if(clientAddress === false) return {success:false, message: "Mauvaise adresse postale du client"};

        const clientCity = securityUtils.validateString(clientData.city, regex.stdStrRegex);
        if(clientCity === false) return {success:false, message: "Mauvaise ville du client"};

        const clientZipcode = securityUtils.validateString(clientData.zipcode, regex.zipcodeRegex);
        if(clientCity === false) return {success:false, message: "Mauvais code postal du client"};

        await ClientInstance.saveClient([clientID, clientName, clientType, clientMail, clientAddress, clientCity, clientZipcode]);

        return clientID;
    }
}

module.exports = ContractsService;