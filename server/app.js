const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const config = require('./config.json');
const port = config.service_port;

app.get('/config', (req ,res)=>{
    res.json({'url': config.url,'lang': config.lang, 'location': config.location});
})

app.use('/', express.static(path.join(__dirname + '/../public/')));

app.use('/db', db);

app.listen(port);
console.log('Server start on port ' + port);