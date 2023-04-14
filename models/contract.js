const db = require("./mysql_database");

class Contract {
    constructor() {}

    async contractExists(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID FROM Contrat WHERE ID = ?`, [id], (err, result) => {
                if(err) return reject(err);
                else return result[0] ? resolve(result[0]) : resolve(false);
            })
        })
    }

    async findByID(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE ID = ?`, [id], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            });
        })
    }

    async getContracts() {
        return await new Promise((resolve, reject) => {
            console.log("querying")
            db.runQuery(`SELECT * FROM Contrat`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getContractsByClientID(id) {
        return await new Promise((resolve, reject) => {
            console.log("querying")
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE CodeClient = ?`, [id],(err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getContractsByUserID(id) {
        return await new Promise((resolve, reject) => {
            console.log("querying")
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE ID_Utilisateur = ?`, [id],(err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async saveContract(data) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`INSERT INTO Contrat VALUES(?,?,?,?,?,?,?,?)`, [data.id, data.clientID, data.productID, data.userID, data.date, data.qtt, data.dateFin, data.frequency], (err, result) => {
                if(err) return reject(err);
                else return resolve(true);
            })
        })
    }

    async updateContract(data) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`UPDATE Contrat SET CodeProd = ?, QTT = ?, DateFin = ?, Frequence = ? WHERE ID = ?)`, [data.codeProd, data.qtt, data.endDate, data.frequency, data.id], (err, result) => {
                if(err) return reject(err);
                else return resolve(true);
            })
        })
    }

    async deleteContract(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`DELETE FROM Contrat WHERE ID = ?`, [id], (err, result) => {
                if(err) return reject(err);
                else return resolve(true);
            })
        })
    }
}

module.exports = Contract;