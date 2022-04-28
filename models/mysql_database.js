const mysql = require('mysql2');
require("dotenv").config();
let connectionInfo = {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Medisales"
}
let connection = mysql.createPool(connectionInfo);

module.exports = {
    runPreparedQuery: function (query, params, callback) {
        connection.getConnection(function(err, conn) {
            if (err) console.log(err);
            let finalQuery = mysql.format(query, params)
            conn.query(finalQuery, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    if (callback) callback(err, null);
                    connection.releaseConnection(conn);
                } else {
                    if (callback) callback(null, results);
                    connection.releaseConnection(conn);
                }
            });
        });
    },
}