import express from 'express'
const app = express()

app.get('/', function(req, res){
    res.send('Hi')
})

const server = require('http').createServer(app);

server.listen(4000)