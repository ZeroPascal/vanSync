import fs from 'fs'
import path from 'path'
export function copy(src: string, dst: string){
    console.log('Copy',src, dst)
    try{
        src = path.normalize(src)
        dst = path.normalize(dst)
        console.log('Copy',src, dst)
    fs.copyFile(src,dst,(e)=>{
        console.log(e)
    })
    }catch(e){
        console.error('Copy Error',e)
    }
    
}