const db = require("./mysql_database");

class User {
    constructor(username, password = "", firstname = "", lastname = "") {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    async userExists() {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else {
                    if(result[0]) return resolve(true)
                    else return resolve(false);
                }
            })
        })
    }

    async getUserPass() {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Passwd FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0].Passwd);
            });
        })
    }

    async getNames() {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Nom, Prenom FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            })
        })
    }

    async getUser() {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID, Nom, Prenom FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            })
        })
    }
}

module.exports = User;