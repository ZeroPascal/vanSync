import fs from 'fs'
import path from 'path'
import folders from './folderTypes';



const configFolder = path.join(__dirname, '../local')
const configFile = path.join(configFolder, 'vanPJ.json')

function writeFile(folders: folders){
    // console.log('Writing Config',Object.values(config.Patch).length)
     fs.writeFile(configFile, JSON.stringify(folders), (err:any)=> {
         if(err) throw new Error('ServerConfig Write Error: '+err)
     })
 }
 export function writeLocal(folders: folders){
     try{
     if(!fs.existsSync(configFolder)){
         fs.mkdir(configFolder,(err: any)=>{
             if(err){
                 throw new Error('ServerConfig MKDIR Error: '+err)
             } else{
                 writeFile(folders)
             }
         })
     }else{
         writeFile(folders)
     }
    
     
     }catch(e){
         console.error(e)
     }
 }
 export function getLocal() {
 
     try {
         
         return JSON.parse(fs.readFileSync(configFile).toString()) as folders
 
     } catch (e) {
        // console.log('Could Not Read Config')
         
        writeLocal({})
            
         return {}
     }
 }