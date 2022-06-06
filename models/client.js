const db = require("./mysql_database");

class Client {
    constructor() {}

    async findByName(name, getData) {
        return await new Promise((resolve, reject) => {
            let query = `SELECT `;
            if(getData === true) query += `*`;
            else query += `CodeClient`;

            query += ` FROM Client WHERE Nom = ?`;

            db.runPreparedQuery(query, [name], (err, result) => {
                if(err) return reject(err);
                else {
                    if(getData === true) return resolve(result[0]);
                    else return result[0] ? true : false;
                }
            });
        })
    }

    async findByID(id, getData) {
        return await new Promise((resolve, reject) => {
            let query = `SELECT `;
            if(getData === true) query += `*`;
            else query += `CodeClient`;

            query += ` FROM Client WHERE CodeClient = ?`;

            db.runPreparedQuery(query, [id], (err, result) => {
                if(err) return reject(err);
                else {
                    if(getData === true) return resolve(result[0]);
                    else return result[0] ? true : false;
                }
            });
        })
    }

    async getClients() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM Client`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async saveClient(client) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`INSERT INTO Client VALUES(?,?,?,?,?,?,?)`, client, (err, result) => {
                if(err) return reject(err);
                else return resolve(true);
            })
        })
    }
}

module.exports = Client;