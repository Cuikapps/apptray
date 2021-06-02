import { Injectable } from '@angular/core';
import { Setting } from '@app/interfaces/setting';

export type activeControls = 'none' | 'trash-can' | 'move' | 'edit' | 'setting';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {
    if (localStorage.getItem('apptray-settings') === null) {
      const settings: Setting = {
        searchEngine: 'Google',
      };

      localStorage.setItem('apptray-settings', JSON.stringify(settings));
    }
  }

  //#region activeControl
  private _activeControl: activeControls = 'none';
  public get activeControl(): activeControls {
    return this._activeControl;
  }
  public set activeControl(value: activeControls) {
    this._activeControl = value;
  }
  //#endregion

  //#region editingApp
  private _editingApp = ' ';
  public get editingApp(): string {
    return this._editingApp;
  }
  public set editingApp(value: string) {
    this._editingApp = value;
  }
  //#endregion

  //#region editorToggle
  private _editorToggle = false;
  public get editorToggle(): boolean {
    return this._editorToggle;
  }
  public set editorToggle(value: boolean) {
    this._editorToggle = value;
  }
  //#endregion

  //#region accountToggle
  private _accountToggle = false;
  public get accountToggle(): boolean {
    return this._accountToggle;
  }
  public set accountToggle(value: boolean) {
    this._accountToggle = value;
  }
  //#endregion

  //#region creatorToggle
  private _creatorToggle = false;
  public get creatorToggle(): boolean {
    return this._creatorToggle;
  }
  public set creatorToggle(value: boolean) {
    this._creatorToggle = value;
  }
  //#endregion

  //#region urlToggle
  private _urlToggle = false;
  public get urlToggle(): boolean {
    return this._urlToggle;
  }
  public set urlToggle(value: boolean) {
    this._urlToggle = value;
  }
  //#endregion

  //#region imgUploadToggle
  private _imgUploadToggle = false;
  public get imgUploadToggle(): boolean {
    return this._imgUploadToggle;
  }
  public set imgUploadToggle(value: boolean) {
    this._imgUploadToggle = value;
  }
  //#endregion

  //#region searchEngine
  get searchEngine(): string {
    const settingObj: Setting = JSON.parse(
      localStorage.getItem('apptray-settings') || '{}'
    );

    return settingObj.searchEngine;
  }
  set searchEngine(v: string) {
    const settingObj: Setting = JSON.parse(
      localStorage.getItem('apptray-settings') || '{}'
    );

    settingObj.searchEngine = v;

    localStorage.setItem('apptray-settings', JSON.stringify(settingObj));
  }
  //#endregion
}
