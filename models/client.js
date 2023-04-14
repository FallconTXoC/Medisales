const db = require("./mysql_database");

class Client {
    constructor() {}

    async findByName(name) {

    }

    async findByID(id, getData) {
        return await new Promise((resolve, reject) => {
            let query = `SELECT `;
            if(getData === true) query += `*`;
            else query += `CodeClient`; 

            db.runPreparedQuery(`SELECT * FROM Client WHERE CodeClient = ?`, [id], (err, result) => {
                if(err) return reject(err);
                else {
                    if(getData === true) return resolve(result[0]);
                    else return result[0] ? true : false;
                }
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