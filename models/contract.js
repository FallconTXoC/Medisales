const db = require("./mysql_database");

class Contract {
    constructor() {}

    async contractExists(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID FROM Contrat WHERE ID = ?`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else {
                    if(result[0]) return resolve(true)
                    else return resolve(false);
                }
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
}

module.exports = Contract;