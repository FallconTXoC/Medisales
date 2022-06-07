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
            db.runQuery(`SELECT * FROM Contrat`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getUserContracts(userID) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE ID_Utilisateur = ?`, [userID], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getContractsByClientID(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE CodeClient = ?`, [id],(err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getContractsByUserID(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE ID_Utilisateur = ?`, [id],(err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async saveContract(data) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`INSERT INTO Contrat VALUES(?,?,?,?,?,?,?,?)`, data, (err, result) => {
                if(err) return reject(err);
                else return resolve(true);
            })
        })
    }

    async updateContract(data) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`UPDATE Contrat SET QTT = ?, DateFin = ?, Frequence = ? WHERE ID = ?`, [data.qtt, data.dateFin, data.frequency, data.id], (err, result) => {
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

    async getContractsByDate(userID, startDate, endDate) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Contrat WHERE Date >= ? AND Date <= ? AND ID_Utilisateur = ?`, [startDate, endDate, userID], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }
}

module.exports = Contract;