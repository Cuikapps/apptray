export interface FolderNode {
  folderName: string;
  files: FileNode[];
  folders: FolderNode[];
  metaData: {
    shared: Shared[];
  };
}

export interface FileNode {
  fileName: string;
  fileType: string;
  metaData: {
    shared: Shared[];
  };
}

export interface Shared {
  user: string;
  access: Access;
}

type Access = 'edit' | 'view';
