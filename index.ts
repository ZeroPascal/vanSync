import express from 'express'
import copy from './util/Shell'
import { stringify } from 'querystring'

import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import Folders from './util/folders'
import folders, { fileName, filePath, folderKey } from './util/folderTypes'
import ls from './util/Shell'
import socketCommand from './util/socketCommands'
import { sendFolderList, sendFolders } from './util/socketSenders'
import Watcher from './watcher'
import  { getLocal } from './util/LocalStore'

const app = express()

//let watcher = new Watcher('C:/Users/Winst/OneDrive/Desktop')
app.get('/', function (req, res) {
    res.send('Hi')
})

const server = require('http').createServer(app);
let clients = 0
const io = new Server(server)

    let folders = new Folders(io, getLocal())

    io.on('connection', (socket: Socket) => {
        clients++
        console.log('Socket Connected', clients)

        sendFolderList(io, folders.folderList)
        folders.emitAll()

        socket.on(socketCommand.ADD_FOLDER, (payload: { name: string, location: filePath }) => {

            folders.newFolder(payload.name, payload.location)
            sendFolderList(io, folders.folderList)

        })
        socket.on(socketCommand.REQUEST_FOLDER, (payload: { folderKey: folderKey }) => {
            folders.emitFolder(payload.folderKey)
        })
        socket.on(socketCommand.SYNC_ITEMS, (payload: { src: folderKey, fileNames: fileName[], dst: folderKey }) => {
            folders.syncItems(payload)
        })

        socket.on('disconnect', () => {
            clients--
            console.log('Socket Disconnected', clients)
        })
    })

console.log('Started')

server.listen(4000)