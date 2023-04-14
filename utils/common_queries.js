const db = require("../models/mysql_database");

class CommonQueries {
    constructor() {}

    /**
     * Function that sorts items based on different criterias.
     * 
     * Example structure of "data":
     * 
     * {
     *    mainTable: {
     *        name: "aName",
     *        propertyCode: "primaryKey"
     *    },
     *    criterias: {
     *        aCriteria: {
     *            table_name: "aName",
     *            keyword: "aKeyword",
     *            propertyCode: "aKey",
     *            values: anArray,
     *            isInternal: true or false
     *        },
     *    }
     * }
     * 
     * @param {Object} data 
     * @returns Array of products
     */
    async sortObjects(data) {
        let query = `SELECT * FROM ?? `;
        let params = [];
        let optional_values = {};
        let internalValues = [];
    
        params.push(data.mainTable.name);

        for(let criteria in data.criterias) {
            let criteriaData = data.criterias[criteria];
            if(criteriaData.values.length > 0) {
                if(criteriaData.isInternal === true) internalValues.push(criteriaData)
                else if(criteriaData.values.length > 1) {
                    let suffix = 1;
                    optional_values[criteriaData.table_name] = [];
                    for(let value of criteriaData.values) {
                        let keyword = criteriaData.keyword.concat(suffix);
                        query += `INNER JOIN ?? ?? ON ??.?? = ??.?? `;
                        params.push(criteriaData.table_name, keyword, data.mainTable.table_name, data.mainTable.propertyCode, keyword, data.mainTable.propertyCode);
    
                        optional_values[criteriaData.table_name].push({keyword: keyword, propertyCode: criteriaData.propertyCode, value: value});
                        suffix++;
                    }
                } else {
                    query += `INNER JOIN ?? ON ??.?? = ??.?? AND ??.?? = ? `;
                    params.push(criteriaData.table_name, data.mainTable.table_name, data.mainTable.propertyCode, criteriaData.table_name, data.mainTable.propertyCode, criteriaData.table_name, criteriaData.propertyCode, criteriaData.values[0]);
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
    
        //Ajout des critères de tri contenu dans la table principale
        table_count = 0;
        for(let internal_value of internalValues) {
            if(optional_values.length === 0 && table_count === 0) query += `WHERE `
            else query += `AND `
    
            let value_count = 0;
            if(internal_value.values.length > 1) {
                for(let value of internal_value.values) {
                    if(value_count === 0) query += `??.?? = ? `
                    else query += `OR ??.?? = ? `
                    params.push(data.mainTable.name, internal_value.propertyCode, value)
                    value_count++;
                }
            } else {
                query += `??.?? = ? `
                params.push(data.mainTable.name, internal_value.propertyCode, internal_value.values[0])
            }
        }
    
        return await new Promise((resolve, reject) => {
            db.runPreparedQuery(query, params, (err, result) => {
                if(err) return reject(err);
                else return resolve(result);
            })
        })
    }
}

module.exports = CommonQueries;