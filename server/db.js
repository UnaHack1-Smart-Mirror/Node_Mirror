const express = require('express');
const router = express.Router();
const config = require('./config.json');
const Connection = require('tedious').Connection;
const dbConfig = {
    userName: config.user,
    password: config.password,
    server: config.server,
    // If you are on Microsoft Azure, you need this:  
    options: {
        encrypt: true,
        database: 'Meow'
    }
};
const connection = new Connection(dbConfig);
connection.on('connect', function (err) {
    // If no error, then good to proceed.  
    console.log("Connected");
});

const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

router.get('/', (req, res) => {

    var request = new Request("SELECT * FROM unahack1  WHERE id=(SELECT max(id) FROM unahack1)", function (err) {
        if (err) {
            console.log(err);
        }
    });

    var result = "";
    request.on('row', function (columns) {
        var data = [];
        data[0] = parseInt(columns[2].value.substr(0, 2), 16);
        data[1] = parseInt(columns[2].value.substr(2, 2), 16) - 128;
        res.status(200).json({
            "hum": data[0],
            "temp": data[1]
        });
        result = "";
    });
    connection.execSql(request);

})

module.exports = router;