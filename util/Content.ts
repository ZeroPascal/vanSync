import { content,fileName,fileType,syncStats,syncProgress,fileLink, filePath, fileTypes } from "./folderTypes";
import path from 'path'
type stats={
    dev: number,
    mode: number,
    nlink: number,
    uid: number,
    gid: number,
    rdev: number,
    blksize: number,
    ino: number,
    size: number,
    blocks: number,
    atimeMs: number,
    mtimeMs: number,
    ctimeMs: number,
    birthtimeMs: number,
    atime: Date,
    mtime: Date,
    ctime: Date,
    birthtime: Date
}

export default class Content implements content{
    fileName: fileName
    filePath: filePath
    fileType: fileTypes
    size: number
    dateMade: number
    dateModified: number
    syncStatus: syncStats
    syncProgress: number
    linkedTo: undefined
    constructor(fileString: string, stats: stats){
       this.fileName = path.basename(fileString)
       this.filePath = path.dirname(fileString)
       let type = fileType.UNKNOWN
       switch(path.extname(fileString)){
           case '.png':
               type= fileType.MEDIA;
               break;
       }
       this.fileType = type
       this.size = stats.size
       this.dateMade = stats.birthtimeMs
       this.syncStatus = syncStats.NOT_SYNCED
       this.linkedTo = undefined

      // console.log('Conent Made',this.fileName)
    }
}