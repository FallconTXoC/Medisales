const mysql = require('mysql2');
require("dotenv").config();
let connectionInfo = {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Medisales"
}
let pool = mysql.createPool(connectionInfo);

module.exports = {
    runPreparedQuery: function (query, params, callback) {
        let finalQuery = mysql.format(query, params)
        this.runQuery(finalQuery, callback);
    },

    runQuery: function (query, callback) {
        pool.getConnection(function(err, conn) {
            if(err) console.log(err);
            if(process.env.DEBUG === 'true') console.log(query);
            conn.query(query, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    if(callback) callback(err, null);
                    conn.release();
                } else {
                    if(callback) callback(null, results);
                    conn.release();
                }
            });
        });
    }
}