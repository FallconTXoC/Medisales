const db = require("./mysql_database");

class Products {
    constructor() {}

    async productExists(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT CodeProd FROM Produit WHERE CodeProd = ?`, [codeprod], (err, result) => {
                if(err) return reject(err);
                else {
                    if(result[0]) return resolve(true)
                    else return resolve(false);
                }
            })
        })
    }

    async findByName(name) {
        return await new Promise((resolve, reject) => {
            let param = [`${name}%`]
            db.runPreparedQuery(`SELECT * FROM Produit WHERE Libelle LIKE ?`, param, (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            });
        })
    }

    async findByID(id) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT * FROM Produit WHERE CodeProd = ?`, [id], (err, result) => {
                if(err) return reject(err);
                else return resolve(result[0]);
            });
        })
    }

    async getProducts() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM Produit`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    async getPrincipesActifs(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT PA.* FROM PrincipeActif PA, Prod_Contient PC WHERE PC.CodeProd = ? AND PC.CodeMol = PA.CodeMol`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getSymptomes(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Sy.* FROM Symptome Sy, Prod_Usage PU WHERE PU.CodeProd = ? AND PU.CodeSympt = Sy.CodeSympt`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getMaladies(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Ma.* FROM Maladie Ma, Prod_Combat PC WHERE PC.CodeProd = ? AND PC.CodeMaladie = PA.CodeMaladie`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getForme(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT Fo.* FROM Forme Fo, Produit P WHERE P.CodeProd = ? AND P.CodeForme = Fo.CodeForme`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getVoieAdmin(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT VA.* FROM VoieAdmin VA, Produit P WHERE P.CodeProd = ? AND P.CodeVoieAdmin = VA.CodeVoieAdmin`, [this.codeprod], (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getAllPrincipesActifs() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM PrincipeActif`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getAllFormes() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM Forme`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getAllVoiesAdmin() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM VoieAdmin`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getAllSymptomes() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM Symptome`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }

    async getAllMaladies() {
        return await new Promise((resolve, reject) => {
            db.runQuery(`SELECT * FROM Maladie`, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }
}

module.exports = Products;