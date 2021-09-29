import { Server } from "socket.io";
import { folder, folderKey } from "./folderTypes";
import { getDirectoryList } from "./LocalReader";
import socketCommand from "./socketCommands";

export function sendFolder(socket: Server, folderKey: folderKey, folder: folder){
   // console.log('Sending Folder')
    socket?.emit(socketCommand.EMITTING_FOLDER,{folderKey,folder})
}

export function sendFolders(socket: Server, folders: string[]){
    socket?.emit(socketCommand.EMITTING_FOLDERS,{folders})
}

export function sendFolderList(socket: Server, folders:string[]= []){
    socket?.emit(socketCommand.EMITTING_FOLDER_LIST, {list:getDirectoryList(folders)})
}