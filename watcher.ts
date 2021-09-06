import chokidar from 'chokidar'
export default class Watcher{
    constructor(){
        chokidar.watch('.').on('all',(event,path)=>{
          //  console.log(event,path)
        })
    }
}