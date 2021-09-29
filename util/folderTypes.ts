import path from 'path'
import Content from './Content';
import Folder from './Folder';

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
    'OUT_OF_SYNC' = 'OUT_OF_SYNC',
    'SYNCING' = 'SYNCING',
    'ERROR' = 'ERROR',
    'PARENT' = 'PARENT'
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

export type link = {
    parent: folderKey,
    file: fileName,
    fileSize: number,
    dateModified: number,
    children: folderKey[]
}

export type filePath= string

export type content={
    folderKey: folderKey
    fileName: fileName,
    fileType: fileTypes,
    filePath: filePath
    size: number, //Megabytes
    dateMade: number,
    dateModified: number,
    syncStatus: syncStatus,
    syncProgress: syncProgress //0-100
    link: link | undefined
}
export type folder={
    key: folderKey,
    name: string,
    location: filePath,
    content: Record<fileName, Content>,
    selected: selectedStatus
}

export type folders= Record<folderKey,Folder>


export default folders