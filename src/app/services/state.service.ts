import { Injectable } from '@angular/core';

export type activeControls = 'none' | 'trash-can' | 'move' | 'edit';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  //#region activeControl
  private _activeControl: activeControls = 'none';
  public get activeControl() {
    return this._activeControl;
  }
  public set activeControl(value: activeControls) {
    this._activeControl = value;
  }
  //#endregion

  //#region editingApp
  private _editingApp: string = ' ';
  public get editingApp(): string {
    return this._editingApp;
  }
  public set editingApp(value: string) {
    this._editingApp = value;
  }
  //#endregion

  //#region editorToggle
  private _editorToggle: boolean = false;
  public get editorToggle(): boolean {
    return this._editorToggle;
  }
  public set editorToggle(value: boolean) {
    this._editorToggle = value;
  }
  //#endregion

  //#region accountToggle
  private _accountToggle: boolean = false;
  public get accountToggle(): boolean {
    return this._accountToggle;
  }
  public set accountToggle(value: boolean) {
    this._accountToggle = value;
  }
  //#endregion

  //#region creatorToggle
  private _creatorToggle: boolean = false;
  public get creatorToggle(): boolean {
    return this._creatorToggle;
  }
  public set creatorToggle(value: boolean) {
    this._creatorToggle = value;
  }
  //#endregion

  //#region urlToggle
  private _urlToggle: boolean = false;
  public get urlToggle(): boolean {
    return this._urlToggle;
  }
  public set urlToggle(value: boolean) {
    this._urlToggle = value;
  }
  //#endregion

  //#region imgUploadToggle
  private _imgUploadToggle: boolean = false;
  public get imgUploadToggle(): boolean {
    return this._imgUploadToggle;
  }
  public set imgUploadToggle(value: boolean) {
    this._imgUploadToggle = value;
  }
  //#endregion
}
