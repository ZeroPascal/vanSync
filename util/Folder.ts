import chokidar from 'chokidar'
import path from 'path'
import Content from "./Content";
import {Server} from 'socket.io'
import { folder, content, filePath, folderKey, selectedStatus, selectedStats, fileName } from "./folderTypes";
import { sendFolder } from './socketSenders';

const settings={
    persistent: true,
    followSymlinks: false,
    depth: 0,
}
export default class Folder implements folder{
    key: folderKey
    name: string
    location: filePath
    content: Record<fileName, Content>
    selected: selectedStatus
    constructor(io: Server, key: folderKey, name: string, location: filePath, content: Record<fileName, content> | undefined){
        
        this.key = key
        this.name = name
        this.location = location
        this.selected = selectedStats.NOT_SELECTED
        this.content = {}
        if(content){
        Object.entries(content).forEach(c=>{
            this.content[c[0]] = Object.assign(new Content('',undefined),c[1])
        }) 
        console.log(this.content)
        } 
        if(this.location){
        let p  = path.normalize(this.location)
        console.log(this.name, 'Now Watching',p)
        chokidar.watch(p, settings).on('add', (event, stats)=>{
            let c= new Content(event, stats)
            let old = this.content[c.fileName]
            this.content[c.fileName] = c
            if(old){
                console.log('Found Old', old.fileName)
                this.content[c.fileName].linkedTo = old.linkedTo
           
            } 
            this.emitFolder(io)
        })
        chokidar.watch(p, settings).on('unlink', (event)=>{
            console.log('File Removed',path.basename(event))

            Object.entries(this.content).filter(c=> c[1].fileName !== path.basename(event) ).forEach(f=>{
                delete this.content[f[0]]
            })
            this.emitFolder(io)
        })
        chokidar.watch(p, settings).on('addDir',(event, stats)=>{
            if(event !==p){
                let c= new Content(event, stats)
                let old = this.content[c.fileName]
                this.content[c.fileName] = c
                if(old){
                    this.content[c.fileName].linkedTo = old.linkedTo
               
                } 
            this.emitFolder(io)
            }
        })
        }
        
    }
    emitFolder(io: Server){
        console.log('Emitting Folder',this.key)
        sendFolder(io,this.key,this)
    }

    
}