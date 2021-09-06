import chokidar from 'chokidar'
import path from 'path'
import Content from "./Content";
import {Server} from 'socket.io'
import { folder, content, filePath, folderKey, selectedStatus, selectedStats } from "./folderTypes";
import { sendFolder } from './socketSenders';

export default class Folder implements folder{
    key: folderKey
    name: string
    location: filePath
    content: content[]
    selected: selectedStatus
    constructor(io: Server, key: folderKey, name: string, location: filePath, f: folder = undefined){
        if(f){
            Object.assign(this, f)
        } else{
        this.key = key
        this.name = name
        this.location = location
        this.selected = selectedStats.NOT_SELECTED
        this.content = []
        if(this.location){
        let p  = path.normalize(this.location)
        console.log(this.name, 'Now Watching',p)
        chokidar.watch(p).on('add', (event, path)=>{
            this.content.push(new Content(event, path))
           // this.emitFolder(io)
        })
        }
        }
    }
    emitFolder(io: Server){
        console.log('Emitting Folder',this.key)
        sendFolder(io,this.key,this)
    }
    
}