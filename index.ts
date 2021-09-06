import express from 'express'

import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import Watcher from './watcher'

const app = express()

let watcher = new Watcher()
app.get('/', function(req, res){
   res.send('Hi')
})

const server = require('http').createServer(app);
let clients = 0
const io = new Server(server)
io.on('connection',(socket:Socket)=>{
    clients++
    console.log('Socket Connected',clients)

    socket.on('disconnect',()=>{
        clients--
        console.log('Socket Disconnected',clients--)
    })
})


server.listen(4000)