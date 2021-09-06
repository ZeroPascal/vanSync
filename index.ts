import express from 'express'
import { stringify } from 'querystring'

import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import Folders from './util/folders'
import { filePath, folderKey } from './util/folderTypes'
import socketCommand from './util/socketCommands'
import { sendFolderList, sendFolders } from './util/socketSenders'
import Watcher from './watcher'

const app = express()

//let watcher = new Watcher('C:/Users/Winst/OneDrive/Desktop')
app.get('/', function(req, res){
   res.send('Hi')
})

const server = require('http').createServer(app);
let clients = 0
const io = new Server(server)
let folders = new Folders(io)
io.on('connection',(socket:Socket)=>{
    clients++
    console.log('Socket Connected',clients)
    
    sendFolderList(io)
    folders.emitAll()

    socket.on(socketCommand.ADD_FOLDER, (payload: {name:string, location: filePath})=>{
       
        folders.newFolder(payload.name,payload.location)
    })
    socket.on(socketCommand.REQUEST_FOLDER,(payload:{folderKey:folderKey})=>{
        folders.emitFolder(payload.folderKey)
    })

    socket.on('disconnect',()=>{
        clients--
        console.log('Socket Disconnected',clients)
    })
})


server.listen(4000)