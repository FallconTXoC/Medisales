const db = require("./mysql_database");

class User {
    constructor(username, password = "", firstname = "", lastname = "", equipe = 0) {
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.equipe = equipe;
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
        const user = await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID, Nom, Prenom, Equipe FROM Utilisateur WHERE ID = ?`, [this.username], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            })
        })

        this.firstname = user.Prenom;
        this.lastname = user.Nom;
        this.equipe = user.Equipe;

        return this;
    }

    async getTeamMembers(equipe) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT ID, Nom, Prenom FROM Utilisateur WHERE Equipe = ?`, [equipe], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getGoal(dateDebut, dateFin) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT OBJ.QttVentes FROM Utilisateur, Objectif OBJ WHERE Utilisateur.ID = ? AND Utilisateur.Equipe = OBJ.Equipe AND OBJ.DateDebut >= ? AND OBJ.DateFin <= ?`, [this.username, dateDebut, dateFin], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0].QttVentes);
            })
        })
    }
}

module.exports = User;