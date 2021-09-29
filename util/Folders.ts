import folders, { folder, folderKey, filePath, fileName } from "./folderTypes";
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Folder from "./Folder";
import { Server } from "socket.io";
import { sendFolders } from "./socketSenders";
import { Console } from "console";
import copy from "./Shell";
import { writeLocal } from "./LocalStore";

export default class Folders{
 
    folders: folders
    io: Server
    constructor(io: Server, local:folders ={}){
        this.folders ={}
        this.makeFolders(local)
        this.io = io
    }
    private makeFolders(local:folders){
        Object.values(local).forEach(f=>{
            if(f){
                console.log('Adding',f.key)
                this.addFolder(f)
            }
        })
    }
    newFolder(name: string, folderPath: filePath){
        if(!this.folderCheck(folderPath)){
            return
        }
        let key = uuidv4()
        this.folders[key] = new Folder(this.io, key,name,folderPath, undefined)
        this.emitFolders()
    }
    addFolder(folder: folder){
        if(!this.folderCheck(folder.location)){
            return 
        }
        this.folders[folder.key] = new Folder(this.io, folder.key,folder.name,folder.location,folder.content)
        this.emitFolders()
    }
    removeFolder(key: folderKey){
        delete this.folders[key]
        this.emitFolders()
    }
    private emitFolders(){
        console.log('Emitting Folders')
        sendFolders(this.io,Object.keys(this.folders))
       
    }
    emitAll(){
        sendFolders(this.io,Object.keys(this.folders))
        Object.values(this.folders).forEach(f=>{

            f.emitFolder(this.io)
        })
    }
    emitFolder(folderKey: folderKey){
        writeLocal(this.folders)
        this.folders[folderKey]? this.folders[folderKey].emitFolder(this.io) : console.log('Invalid Folder Request',folderKey)
    }
    private folderCheck(folderPath: filePath){
        let good = true
        Object.values(this.folders).forEach(f=>{
            if(f.location === folderPath){
                good= false
                console.error('Attempted to add Duplicate Location')
            }
           
        })
        return good
    }

    syncItems(payload: {src: folderKey, fileNames: fileName[], dst: folderKey} ){
        const {src, fileNames, dst} = payload
        if(this.folders[src] && this.folders[dst]){
           let s = this.folders[src]
           let d = this.folders[dst]
            let files = Object.values(this.folders[src].content).filter(c=>{
                return fileNames.includes(c.fileName)
            })
            if(!files){
                console.error('Bad Folder Sync Sort', files)
                return 
            } 
            
            files.forEach(f=>{
                f.LinkTo(src, dst)
            
                copy(f.FilePath,this.folders[dst].location)
                console.log('Sync Set',f.FilePath,'->',this.folders[dst].location)
            })
        }
       
    }

    get folderList(){
        return Object.values(this.folders).map(f=> {return f.location})
    }

}