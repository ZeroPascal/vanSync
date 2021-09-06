import path from 'path'

export type folderKey= string

export enum fileType{
    'MEDIA' = 'MEDIA',
    'FOLDER' = 'FOLDER',
    'UNKNOWN'= 'UNKNOWN'
}

export type fileTypes = keyof typeof fileType

export enum syncStats{
    'SYNCED'= 'SYNCED',
    'NOT_SYNCED'= 'NOT_SYNCED',
    'SYNCING' = 'SYNCING',
    'ERROR' = 'ERROR'
}

export type syncStatus = keyof typeof syncStats;
export enum selectedStats{
    'SELECTED' = 'SELECTED',
    'NOT_SELECTED'= 'NOT_SELECTED',
    'PARENT_SELECTED' = 'PARENT_SELECTED'
}
export type selectedStatus = keyof typeof selectedStats;
export type fileName= string;
export type syncProgress = number;

export type fileLink = {
    parent: folderKey,
    file: fileName,
    children: folderKey[]
}

export type filePath= string

export type content={
    fileName: fileName,
    fileType: fileTypes,
    filePath: filePath
    size: number, //Megabytes
    dateMade: number,
    dateModified: number,
    syncStatus: syncStatus,
    syncProgress: syncProgress //0-100
    linkedTo: fileLink | undefined
}
export type folder={
    key: folderKey,
    name: string,
    location: filePath,
    content: content[],
    selected: selectedStatus
}

export type folders= folderKey[]


export default folders