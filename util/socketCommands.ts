
enum socketCommand {
    'EMITTING_FOLDERS' = 'EMITTING_FOLDERS', //Sends All Folders
    'EMITTING_FOLDER'= 'EMITTING_FOLDER', //Sends 1 Folder
    'EMITTING_FOLDER_LIST' = 'EMITTING_FOLDER_LIST', //Sends list of directories that can be watched
    'ADD_FOLDER' = 'ADD_FOLDER', // Sends Name and Location
    'REQUEST_FOLDER'= 'REQUEST_FOLDER' //Sends folderKey
    
}

export type socketCommands = keyof typeof socketCommand
export default socketCommand