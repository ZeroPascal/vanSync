import { content, fileName, fileType, syncStats, syncProgress, link, filePath, fileTypes, folderKey } from "./folderTypes";
import path from 'path'
type stats = {
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

export default class Content implements content {
    folderKey: folderKey
    fileName: fileName
    filePath: filePath
    fileType: fileTypes
    size: number
    dateMade: number
    dateModified: number
    syncStatus: syncStats
    syncProgress: number
    link: link | undefined

    constructor(folderKey: folderKey, fileString: string = '', stats: stats | undefined) {
        this.folderKey = folderKey
        this.fileName = path.basename(fileString)
        this.filePath = path.dirname(fileString)
        let type = fileType.UNKNOWN
        switch (path.extname(fileString)) {
            case '.png':
                type = fileType.MEDIA;
                break;
            case '':
                type = fileType.FOLDER;
        }

        this.fileType = type
        if (stats) {
            this.size = stats.size
            this.dateMade = stats.birthtimeMs
            this.dateModified = stats.mtimeMs

        } else {
            this.size = 0
            this.dateMade = 0
            this.dateModified = 0


        }
        this.syncStatus = syncStats.NOT_SYNCED
        this.link = undefined

      //  this.watchLink()
        // console.log('Conent Made',this.fileName)
    }
    get FilePath() {
        return this.filePath + '/' + this.fileName
    }

    updateSize(fileSize: number) {
        this.size = fileSize
        this.watchLink()
        //if(this.linkedTo)
    }
    syncedCheck(){
        return ( this.size === this.link.fileSize)
        //this.link.dateModified<=this.dateModified &&
    }

    addChild(dst: folderKey){
        if(!this.link.children.includes(dst)){
            this.link.children.push(dst)
            this.watchLink()
        }
    }

    removeChild(dst: folderKey){
        if(!this.link.children.includes(dst)){
            this.link.children = this.link.children.filter(f=> f!==dst)
            this.watchLink()
        }
        
    }

    set Link(fileLink: link) {
        this.link = fileLink
      
        if(!this.link || this.link.children.length === 0){
            this.syncStatus = syncStats.NOT_SYNCED
        }else if (this.link && this.link.children.includes(this.folderKey) && !this.syncedCheck()) {
           
            this.syncStatus = syncStats.OUT_OF_SYNC
            
          
        } else{
            this.syncStatus = syncStats.SYNCED
        }
        this.watchLink()
        //callback(this.watchLink())
    }

    get Link() {
        
        return this.link
    }
    set Size(size:number){
        this.size = size
        this.watchLink()
    }
    watchLink() {
      
          if(!this.link) return
         
          if(this.link.parent === this.folderKey){ 
            console.log(this.link.parent, this.folderKey)
            if(this.Link.children === [] || this.Link.children.length <=0){
                //console.log('Child Lenght', this.Link.children.length)
                this.syncStatus =syncStats.NOT_SYNCED
            } else{
                this.syncStatus = syncStats.PARENT
            }
           
          } else{ //Is Parent
            console.log('Child Setting Sync Status')
            this.syncedCheck()? this.syncStatus = syncStats.SYNCED : syncStats.SYNCING
          }

        
    }


}