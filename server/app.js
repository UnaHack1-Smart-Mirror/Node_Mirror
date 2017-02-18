const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const config = require('./config.json');
const port = 8000;

app.get('/config', (req ,res)=>{
    res.json({'url': config.url});
})

app.use('/', express.static(path.join(__dirname + '/../public/')));

app.use('/db', db);

app.listen(port);
console.log('Server start on port ' + port);