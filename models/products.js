const db = require("./mysql_database");

class Products {
    constructor() {}

    async productExists(codeprod) {
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(`SELECT CodeProd FROM Produit WHERE CodeProd = ?`, [this.codeprod], (err, result) => {
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
            console.log("querying")
            db.runQuery(`SELECT * FROM Produit`, (err, result) => {
                console.log("result out")
                if(err) return reject(err);
                else return resolve(result);
            });
        })
    }

    /**
     * Function that sorts products based on different criterias.
     * 
     * Criterias are defined in an object containing all tables related
     * to a product and specifying the values that need to be matched
     * in each table, along with the keyword for the table, its name or
     * link table name and the name of the primary key (of the relevant
     * criteria).
     * 
     * @param {Object} data 
     * @returns Array of products
     */
    async sortProducts(data) {
        let query = `SELECT * FROM Produit `;
        let params = [];
        let optional_values = {};
        let internalValues = [];

        for(let table in data.tables) {
            let tableData = data.tables[table];
            if(tableData.values.length > 0) {
                if(tableData.isInternal === true) internalValues.push(tableData)
                else if(tableData.values.length > 1) {
                    let suffix = 1;
                    optional_values[tableData.name] = [];
                    for(let value of tableData.values) {
                        let keyword = tableData.keyword.concat(suffix);
                        query += `INNER JOIN ?? ?? ON Produit.CodeProd = ??.CodeProd `;
                        params.push(tableData.name, keyword, keyword);

                        optional_values[tableData.name].push({keyword: keyword, propertyCode: tableData.propertyCode, value: value});
                        suffix++;
                    }
                } else {
                    query += `INNER JOIN ?? ON Produit.CodeProd = ??.CodeProd AND ??.?? = ? `;
                    params.push(tableData.name, tableData.name, tableData.name, tableData.propertyCode, tableData.values[0]);
                }
            }
        }

        //Ajout des critères de tri multiples sur une même table
        let table_count = 0;
        for(let optional_table in optional_values) {
            let value_count = 0;
            if(table_count === 0) query += `WHERE `
            else query += `AND `
            for(let value of optional_values[optional_table]) {
                if(value_count === 0) query += `(??.?? = ? `
                else query += `AND ??.?? = ? `

                params.push(value.keyword, value.propertyCode, value.value)
                value_count++;
            }
            query += `) `
            table_count++;
        }

        //Ajout des critères de tri contenu dans la table Produit
        table_count = 0;
        for(let internal_value of internalValues) {
            if(optional_values.length === 0 && table_count === 0) query += `WHERE `
            else query += `AND `

            let value_count = 0;
            if(internal_value.values.length > 1) {
                for(let value of internal_value.values) {
                    if(value_count === 0) query += `Produit.?? = ? `
                    else query += `OR Produit.?? = ? `
                    params.push(internal_value.propertyCode, value)
                    value_count++;
                }
            } else {
                query += `Produit.?? = ? `
                params.push(internal_value.propertyCode, internal_value.values[0])
            }
        }

        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(query, params, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
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
}

module.exports = Products;