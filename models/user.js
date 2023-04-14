const db = require("./mysql_database");

class User {
    constructor(username, password = "", firstname = "", lastname = "") {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    async userExists() {
        await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else {
                    if(result[0].length > 0) return resolve(true);
                    else return resolve(false);
                }
            })
        })
    }

    async getUserPass() {
        await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Passwd FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getNames() {
        await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Nom, Prenom FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }
}

module.exports = User;