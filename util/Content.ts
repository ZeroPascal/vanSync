import { content,fileName,fileType,syncStats,syncProgress,fileLink, filePath, fileTypes, folderKey } from "./folderTypes";
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
    linkedTo: fileLink | undefined
  
    constructor(fileString: string ='', stats: stats | undefined){
       this.fileName = path.basename(fileString)
       this.filePath = path.dirname(fileString)
       let type = fileType.UNKNOWN
       switch(path.extname(fileString)){
           case '.png':
               type= fileType.MEDIA;
               break;
            case '':
                type = fileType.FOLDER;
       }
       
       this.fileType = type
       if(stats){
       this.size = stats.size
       this.dateMade = stats.birthtimeMs
      
       }else{
           this.size = 0
           this.dateMade = 0
     

       }
       this.syncStatus = syncStats.NOT_SYNCED
       this.linkedTo = undefined


      // console.log('Conent Made',this.fileName)
    }
    get FilePath(){
        return this.filePath+'/'+this.fileName
    }

    LinkTo(src: folderKey, child: folderKey){
        if(!this.linkedTo){
            this.linkedTo = { parent: src, file: this.fileName, children: [child]}
        }else{
            this.linkedTo.children.push(child)
        }

    }
}