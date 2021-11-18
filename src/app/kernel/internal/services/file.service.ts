import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  firstValueFrom,
  Subject,
  tap,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { FolderNode } from '../../interface/nodes';
import { UploadFileDTO } from '../../interface/uploadFile.dto';
import { invalidNamingChars } from '../data/Constants';
import { ApptrayURLs, ApptrayWS, AuthURLs } from '../data/EApiUrls';

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

  constructor(private readonly http: HttpClient) {
    // Get the file tree from server
    firstValueFrom(
      http.get<FolderNode>(environment.apiURL + ApptrayURLs.GET_FILES_TREE, {
        withCredentials: true,
      })
    ).then((v) => {
      this.fileTree.next(v);
    });
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
        // TODO Replace with pop-up service functions
        alert('Folder name cannot contain characters: / \\ < > ? . | " * :');
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

      const bin = await firstValueFrom(
        this.http.get<{ bin: string }>(
          environment.apiURL + ApptrayURLs.DOWNLOAD_FILES,
          {
            withCredentials: true,
            params: {
              data: encodeURIComponent(JSON.stringify({ path, names })),
            },
          }
        )
      );

      const array = new Uint8Array(bin.bin.length);
      for (let i = 0; i < bin.bin.length; i++) {
        array[i] = bin.bin.charCodeAt(i);
      }

      const blob = new Blob([array], { type: 'application/octet-stream' });

      this.download(blob);
    } catch (error) {
      console.error(error);
    }
  }

  async uploadFile(file: File | any, path: string): Promise<void> {
    try {
      let filePath: string = file.webkitRelativePath
        ? path.replace(/\//g, '>') + file.webkitRelativePath.replace(/\//g, '>')
        : path.replace(/\//g, '>') + file.name;

      const fileBuffers = await this.chunkFile(file);

      const userToken = await firstValueFrom(
        this.http.get<{ token: string }>(
          environment.apiURL + AuthURLs.GET_TOKEN,
          {
            withCredentials: true,
          }
        )
      );

      const ws = this.createWS(environment.apiWS);
      const data: UploadFileDTO = {
        path: filePath,
        formData: {
          file_buffer: JSON.stringify(fileBuffers[0]),
          type: file.type,
        },
        metaData: { shared: [] },
        token: userToken.token,
        last: true,
      };

      ws.next(
        new MessageEvent<UploadFileDTO>(ApptrayWS.START_UPLOAD, {
          data: data,
        })
      );

      const sub = ws.subscribe((msg: MessageEvent) => {
        console.log(msg);

        if (JSON.parse(msg.data).last) {
          ws.complete();
          sub.unsubscribe();
        }
      });

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
        // TODO Replace with pop-up service functions
        alert('Folder name cannot contain characters: / \\ < > ? . | " * :');
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
        // TODO Replace with pop-up service functions
        alert('File name cannot contain characters: / \\ < > ? . | " * :');
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

  private async chunkFile(file: File): Promise<Uint8Array[]> {
    const tempArray = [];

    if (file.size < 6000000) {
      const chunk = new Uint8Array(await file.arrayBuffer());
      tempArray.push(chunk);
      return tempArray;
    }

    for (let i = 0; i < file.size; i += 6000000) {
      const chunk = new Uint8Array(
        await file.slice(i, i + 6000000).arrayBuffer()
      );

      console.log(`Percent Done: ${((i / file.size) * 100).toFixed(2)}`);

      tempArray.push(chunk);
    }

    return tempArray;
  }

  private createWS(url: string): WebSocketSubject<MessageEvent<UploadFileDTO>> {
    const subject = webSocket<MessageEvent<UploadFileDTO>>(url);

    subject.pipe(
      tap({ error: (error) => console.error('Websocket error') }),
      catchError((_) => EMPTY)
    );

    return subject;
  }
}
