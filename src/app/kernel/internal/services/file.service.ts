import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FolderNode } from '../../interface/nodes';
import { UploadFileDTO } from '../../interface/uploadFile.dto';
import { invalidNamingChars } from '../data/Constants';
import { ApptrayURLs, ApptrayWS } from '../data/EApiUrls';
import { io, Socket } from 'socket.io-client';
import { PopUpService } from './pop-up.service';
import { v1 as uuidv1 } from 'uuid';
import { AuthService } from './auth.service';

export interface Upload {
  percent: number;
  timeLeft: number;
  name: string;
  uuid: string;
}

@Injectable()
export class FileService {
  fileTree: BehaviorSubject<FolderNode> = new BehaviorSubject<FolderNode>({
    folderName: 'root',
    files: [],
    folders: [],
    metaData: {
      shared: [],
    },
  });

  currentUploads: BehaviorSubject<Upload[]> = new BehaviorSubject<Upload[]>([]);

  // Max size for each file chunk
  private readonly MAX_FILES_SIZE = 100000;

  constructor(
    private readonly http: HttpClient,
    private readonly popup: PopUpService,
    private readonly auth: AuthService
  ) {
    // Get the file tree from server
    firstValueFrom(
      http.get<FolderNode>(environment.apiURL + ApptrayURLs.GET_FILES_TREE, {
        withCredentials: true,
      })
    ).then((v) => {
      this.fileTree.next(v);
    });

    if (auth.storeData.value) {
      if (localStorage.getItem('uploads-' + auth.storeData.value.uid) !== '') {
        this.currentUploads.next(
          JSON.parse(
            localStorage.getItem('uploads-' + auth.storeData.value.uid) ?? '[]'
          )
        );
      }
    }

    this.currentUploads.subscribe((uploads) => {
      if (auth.storeData.value) {
        localStorage.setItem(
          'uploads-' + auth.storeData.value.uid,
          JSON.stringify(uploads)
        );
      }
    });
  }

  async reloadFileTree(): Promise<void> {
    const newFileTree = await firstValueFrom(
      this.http.get<FolderNode>(
        environment.apiURL + ApptrayURLs.GET_FILES_TREE,
        {
          withCredentials: true,
        }
      )
    );

    this.fileTree.next(newFileTree);
  }

  async createFolder(path: string, name: string): Promise<void> {
    try {
      let valid = true;

      if (name === '') {
        name = 'New Folder';
      }

      for (const char of name) {
        if (invalidNamingChars.includes(char)) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        this.popup.alert(
          'Folder name cannot contain characters: / \\ < > ? . | " * :'
        );
      } else {
        path = path.replace(/\//g, '>');
        path += name;

        await firstValueFrom(
          this.http.post(
            environment.apiURL + ApptrayURLs.CREATE_FOLDER,
            { path },
            { withCredentials: true }
          )
        );

        const newFileTree = await firstValueFrom(
          this.http.get<FolderNode>(
            environment.apiURL + ApptrayURLs.GET_FILES_TREE,
            {
              withCredentials: true,
            }
          )
        );

        this.fileTree.next(newFileTree);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async downloadFiles(path: string, names: string[]): Promise<void> {
    try {
      path = path.replace(/\//g, '>');

      const bin = (
        await firstValueFrom(
          this.http.get<{ bin: string }>(
            environment.apiURL + ApptrayURLs.DOWNLOAD_FILES,
            {
              withCredentials: true,
              params: {
                data: encodeURIComponent(JSON.stringify({ path, names })),
              },
            }
          )
        )
      ).bin;

      const array = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        array[i] = bin.charCodeAt(i);
      }

      const blob = new Blob([array], { type: 'application/octet-stream' });

      this.download(blob);
    } catch (error) {
      this.popup.error('File size to download should be less than 2GB');
      console.error(error);
    }
  }

  async uploadFile(file: File | any, path: string): Promise<void> {
    const socket = io(environment.apiWS + '/file-upload', {
      withCredentials: true,
      extraHeaders: { 'Access-Control-Allow-Credentials': 'true' },
      transports: ['websocket'],
    });

    try {
      const filePath: string = file.webkitRelativePath
        ? path.replace(/\//g, '>') + file.webkitRelativePath.replace(/\//g, '>')
        : path.replace(/\//g, '>') + file.name;

      const fileBuffers = await this.chunkFile(file);

      const uploadID = uuidv1();

      const data: UploadFileDTO = {
        path: filePath,
        formData: {
          file_buffer: fileBuffers[0],
          type: file.type,
        },
        metaData: { shared: [] },
      };

      if (socket.connected) {
        socket.off();
        socket.disconnect();
      }
      socket.connect();

      // If the file size is less than 100kb
      if (fileBuffers.length === 1) {
        await this.awaitSocket(socket, ApptrayWS.START_UPLOAD, data);

        const uploads = this.currentUploads.value;
        uploads.push({
          name: file.name,
          percent: 100,
          timeLeft: 0,
          uuid: uploadID,
        });

        this.currentUploads.next(uploads);
      }

      // If the file size is greater than 100kb
      if (fileBuffers.length > 1) {
        // Add upload to uploads list
        const uploads = this.currentUploads.value;

        let deltaTime = 1;

        uploads.push({
          name: file.name,
          percent: 0,
          timeLeft: deltaTime * fileBuffers.length,
          uuid: uploadID,
        });
        this.currentUploads.next(uploads);

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < fileBuffers.length; i++) {
          const startTime = window.performance.now();
          const continuedData: UploadFileDTO = {
            path: filePath,
            formData: {
              file_buffer: fileBuffers[i],
              type: file.type,
            },
            metaData: { shared: [] },
          };

          const timeRemaining = deltaTime * (fileBuffers.length - i);

          this.updateUpload(
            uploadID,
            (i / (fileBuffers.length - 1)) * 100,
            timeRemaining
          );

          await this.awaitSocket(
            socket,
            ApptrayWS.CONTINUE_UPLOAD,
            continuedData
          );
          const endTime = window.performance.now();

          deltaTime = endTime - startTime;
        }

        await this.awaitSocket(socket, ApptrayWS.END, {
          path: filePath,
          formData: {
            file_buffer: new Uint8Array(0),
            type: file.type,
          },
          metaData: { shared: [] },
        });
      }

      socket.off();
      socket.disconnect();

      const newFileTree = await firstValueFrom(
        this.http.get<FolderNode>(
          environment.apiURL + ApptrayURLs.GET_FILES_TREE,
          {
            withCredentials: true,
          }
        )
      );

      this.fileTree.next(newFileTree);
    } catch (error) {
      socket.off();
      socket.disconnect();
      console.error(error);
    }
  }

  async renameFolder(
    path: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    try {
      // If the old name ends with '/' then remove it
      oldName = oldName.endsWith('/') ? oldName.slice(0, -1) : oldName;

      let valid = true;

      if (newName === '') {
        newName = 'New Folder';
      }

      for (const char of newName) {
        if (invalidNamingChars.includes(char)) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        this.popup.alert(
          'Folder name cannot contain characters: / \\ < > ? . | " * :'
        );
      } else {
        path = path.replace(/\//g, '>');
        path += oldName;

        await firstValueFrom(
          this.http.post(
            environment.apiURL + ApptrayURLs.RENAME_FOLDER,
            { filePath: path, newName },
            { withCredentials: true }
          )
        );

        const newFileTree = await firstValueFrom(
          this.http.get<FolderNode>(
            environment.apiURL + ApptrayURLs.GET_FILES_TREE,
            {
              withCredentials: true,
            }
          )
        );

        this.fileTree.next(newFileTree);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async renameFile(
    path: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    try {
      let valid = true;

      if (newName === '') {
        newName = 'New File';
      }

      for (const char of newName) {
        if (invalidNamingChars.includes(char)) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        this.popup.alert(
          'File name cannot contain characters: / \\ < > ? . | " * :'
        );
      } else {
        path = path.replace(/\//g, '>');
        path += oldName;

        await firstValueFrom(
          this.http.post(
            environment.apiURL + ApptrayURLs.RENAME_FILE,
            { filePath: path, newName },
            { withCredentials: true }
          )
        );

        const newFileTree = await firstValueFrom(
          this.http.get<FolderNode>(
            environment.apiURL + ApptrayURLs.GET_FILES_TREE,
            {
              withCredentials: true,
            }
          )
        );

        this.fileTree.next(newFileTree);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFolder(path: string, name: string): Promise<void> {
    try {
      path = path.replace(/\//g, '>');
      path += name;

      await firstValueFrom(
        this.http.post(
          environment.apiURL + ApptrayURLs.DELETE_FOLDER,
          { path },
          { withCredentials: true }
        )
      );

      const newFileTree = await firstValueFrom(
        this.http.get<FolderNode>(
          environment.apiURL + ApptrayURLs.GET_FILES_TREE,
          {
            withCredentials: true,
          }
        )
      );

      this.fileTree.next(newFileTree);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFile(path: string, name: string): Promise<void> {
    try {
      path = path.replace(/\//g, '>');
      path += name;

      await firstValueFrom(
        this.http.post(
          environment.apiURL + ApptrayURLs.DELETE_FILE,
          { path },
          { withCredentials: true }
        )
      );

      const newFileTree = await firstValueFrom(
        this.http.get<FolderNode>(
          environment.apiURL + ApptrayURLs.GET_FILES_TREE,
          {
            withCredentials: true,
          }
        )
      );

      this.fileTree.next(newFileTree);
    } catch (error) {
      console.error(error);
    }
  }

  removeUpload(id: string): void {
    let uploads = this.currentUploads.value;

    uploads = uploads.filter((upload) => {
      return upload.uuid !== id;
    });

    this.currentUploads.next(uploads);
  }

  private download(blob: Blob): void {
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'downloads.zip');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private awaitSocket<T>(
    socket: Socket,
    event: string,
    data: T
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      socket.emit(event, data, () => {
        resolve();
      });
    });
  }

  private updateUpload(id: string, percent: number, timeLeft: number): void {
    const uploads = this.currentUploads.value;

    uploads.map((upload) => {
      if (upload.uuid === id) {
        upload.percent = percent;
        upload.timeLeft = timeLeft;
      }
    });

    this.currentUploads.next(uploads);
  }

  private async chunkFile(file: File): Promise<Uint8Array[]> {
    const tempArray = [];

    if (file.size < this.MAX_FILES_SIZE) {
      const chunk = new Uint8Array(await file.arrayBuffer());
      tempArray.push(chunk);
      return tempArray;
    }

    for (let i = 0; i < file.size; i += this.MAX_FILES_SIZE) {
      const chunk = new Uint8Array(
        await file.slice(i, i + this.MAX_FILES_SIZE).arrayBuffer()
      );
      tempArray.push(chunk);
    }

    return tempArray;
  }
}
