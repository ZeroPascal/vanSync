import { spawn, exec, execFile } from 'child_process'
import path from 'path'

//let p  = path.normalize('C:/Program Files/Git/git-bash.exe')
let p = path.normalize('./util/CopyLocal.py')
//let p = path.normalize('C:/Users/Winst/')
const defaults ={
   // cwd:p,
    env: process.env
}


export default function copy(src: string, dst: string){
    try{
        src = path.normalize(src)
        dst = path.normalize(dst)
        let l = execFile('python',['util/CopyLocal.py', src, dst])
    l.stdout.on("data", data=>{
        console.log('Data',data.toString())
    })
    l.stderr.on('data', data=>{
        console.log('Error', data)
    })
    l.on('message',m=>{
        console.log('M',m)
    })
    l.on('error',data=>{
        console.log('Error',data)
    })
}catch(e){
    console.error(e)
}
   
}
export  function ls(){
    try{
   // let l = spawn('"C:/Users/Winst/OneDrive/Desktop dir"');
        let l = execFile('python',['util/CopyLocal.py', 'hi'])
    l.stdout.on("data", data=>{
        console.log('Data',data.toString())
    })
    l.stderr.on('data', data=>{
        console.log('Error', data)
    })
    l.on('message',m=>{
        console.log('M',m)
    })
    l.on('error',data=>{
        console.log('Error',data)
    })
}catch(e){
    console.error(e)
}
   
}