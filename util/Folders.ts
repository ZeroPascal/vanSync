import folders, { folder, folderKey, filePath } from "./folderTypes";
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Folder from "./Folder";
import { Server } from "socket.io";
import { sendFolders } from "./socketSenders";
import { Console } from "console";
export default class Folders{
    folders: Record<folderKey,Folder>
    io: Server
    constructor(io: Server){
        this.folders={}
        this.io = io
    }
    newFolder(name: string, folderPath: filePath){
        if(!this.folderCheck(folderPath)){
            return
        }
        let key = uuidv4()
        this.folders[key] = new Folder(this.io, key,name,folderPath)
        this.emitFolders()
    }
    addFolder(folder: folder){
        if(!this.folderCheck(folder.location)){
            return 
        }
        this.folders[folder.key] = new Folder(this.io, folder.key,folder.name,folder.location,folder)
        this.emitFolders()
    }
    removeFolder(key: folderKey){
        delete this.folders[key]
        this.emitFolders()
    }
    private emitFolders(){
        sendFolders(this.io,Object.keys(this.folders))
    }
    emitAll(){
        sendFolders(this.io,Object.keys(this.folders))
        Object.values(this.folders).forEach(f=>{

            f.emitFolder(this.io)
        })
    }
    emitFolder(folderKey: folderKey){
        this.folders[folderKey]? this.folders[folderKey].emitFolder(this.io) : console.log('Invalid Folder Request',folderKey)
    }
    private folderCheck(folderPath: filePath){
        let good = true
        Object.values(this.folders).forEach(f=>{
            if(f.location === folderPath){
                good= false
                console.log('Attempted to add Duplicate Location')
            }
           
        })
        return good
    }

}