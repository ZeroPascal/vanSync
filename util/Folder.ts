import chokidar from 'chokidar'
import path from 'path'
import Content from "./Content";
import { Server } from 'socket.io'
import { folder, content, filePath, folderKey, selectedStatus, selectedStats, fileName } from "./folderTypes";
import { sendFolder } from './socketSenders';
import { io as IO } from '../index';
const settings = {
    persistent: true,
    followSymlinks: false,
    depth: 0,
}
export default class Folder implements folder {

    key: folderKey
    name: string
    location: filePath
    content: Record<fileName, Content>
    selected: selectedStatus
    constructor(io: Server, key: folderKey, name: string, location: filePath, content: Record<fileName, Content> | undefined) {

        this.key = key
        this.name = name
        this.location = location
        this.selected = selectedStats.NOT_SELECTED
        this.content = {}
        if (content) {
            Object.entries(content).forEach(c => {
                this.content[c[0]] = Object.assign(new Content(this.key, '', undefined), c[1])
               // this.content[c[0]].Link = Object.assign(this.content[c[0]].Link, c[1].link)
            })
            //console.log(this.content)
        }
        if (this.location) {
            let p = path.normalize(this.location)
            console.log(this.name, 'Now Watching', p)
            chokidar.watch(p, settings).on('add', (event, stats) => {
                let c = new Content(this.key, event, stats)
                c.watchLink()
                let old = this.content[c.fileName]
                this.content[c.fileName] = c
                if (old) {
                      console.log('Found Old', old.fileName)
                    this.content[c.fileName].Link = old.Link

                }
                this.emitFolder(io)
            })
            chokidar.watch(p, settings).on('unlink', (event) => {
                //console.log('File Removed',path.basename(event))

                Object.entries(this.content).filter(c => { return c[1].fileName === path.basename(event) }).forEach(f => {
                    console.log('Deleteing ', this.content[f[0]].fileName)
                    delete this.content[f[0]]
                })
                this.emitFolder(io)
            })
            chokidar.watch(p, settings).on('addDir', (event, stats) => {
                if (event !== p) {
                    let c = new Content(this.key, event, stats)
                    c.watchLink()
                    let old = this.content[c.fileName]
                    this.content[c.fileName] = c
                    if (old) {
                        this.content[c.fileName].Link = old.Link

                    }

                }
            })
        }
        console.log('Folder Built', this.key)

    }
    addChild(file: Content, dst: folderKey) {
        Object.entries(this.content).forEach(c => {
            if (c[1].fileName === file.fileName) {
                c[1].addChild(dst)
                console.log('Source Folder Adding', c[1].Link)

            }
        })
        this.emitFolder()

    }
    removeChild(file: Content, dst: folderKey) {
        Object.entries(this.content).forEach(c => {
            if (c[1].fileName === file.fileName)
            console.log('Folder Removing Child',c[1].fileName)
                c[1].removeChild(dst)
        })
        this.emitFolder()
    }
    addChildFile(file: Content) {
        file.folderKey = this.key
        file.Size = 0
        file.dateModified = 0
        file.dateMade = 0
        file.watchLink()
        //let c = Object.assign(new Content(this.key, "", undefined), file)
       // c.folderKey = this.key
       // console.log(file)
        this.content[file.fileName] = file
        console.log('ChildFile',file)
        this.emitFolder()
    }
    removeChildFile(file: Content) {
        let deleteFileWhenSyncRemoved = false
        if (deleteFileWhenSyncRemoved) {

        }
        this.content[file.fileName].Link = undefined
        this.emitFolder()
    }
    emitFolder(io: Server = IO) {
        //console.log('Emitting Folder',this.key)
        sendFolder(io, this.key, this)
    }


}