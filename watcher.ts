import chokidar from 'chokidar'
import path from 'path'
import { Socket } from 'socket.io'
import Content from './util/Content'
import { content } from './util/folderTypes'
import socketCommands from './util/socketCommands'
import { sendFolder } from './util/socketSenders'
const settings = {
    persistent: true,

    ignored: '*.png',
    ignoreInitial: false,
    followSymlinks: true,
    cwd: '.',
    disableGlobbing: false,

    usePolling: false,
    interval: 100,
    binaryInterval: 300,
    alwaysStat: false,
    depth: 99,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
}

export default class Watcher {
    content: content[]

    constructor(location: string, socket: Socket) {
        let p = path.normalize(location)
        this.content = []
        chokidar.watch(p, settings).on('add', (event, path) => {
            this.content.push(new Content(event, path))
        })
        //sendFolder(socket, folderKey, folder)
    }
}