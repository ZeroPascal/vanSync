
const fs = require('fs')
const path =require('path')
export function getDirectoryList(folders: string[]= []):string[]{
    let directoryList = path.normalize('local/directoryList.json')
    try{
     
         let list =JSON.parse(fs.readFileSync(directoryList)) as string[]
         return list.filter(item=> !folders.includes(item))
        

    }catch(e){
        fs.writeFile(directoryList, JSON.stringify([]),(err:any)=>{
            if(err) console.error('Bad Write of directoryList')
        })
        return ['Nothing In Local']
    }
}