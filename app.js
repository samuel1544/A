const express = require('express');
const app = express();
const client = require('./routes/client')

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.get('/',(req, res) =>{
    res.json({message:"ok"});
    return req.body.password
});

app.use('/client', client);

module.exports = app;