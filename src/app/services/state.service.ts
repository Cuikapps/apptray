import { Injectable } from '@angular/core';
import { AppIconComponent } from '@app/components/app-icon/app-icon.component';
import { Setting } from '@app/interfaces/setting';
import { ApptrayService } from './apptray.service';

export type activeControls =
  | 'none'
  | 'trash-can'
  | 'move'
  | 'edit'
  | 'setting'
  | 'info';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _accountToggle = false;
  private _activeControl: activeControls = 'none';
  private _creatorToggle = false;
  private _editingApp = ' ';
  private _editorToggle = false;
  private _imgUploadToggle = false;
  private _infoToggle = false;
  private _moveToApp = -1;
  private _urlToggle = false;
  private _viewingApp = ' ';

  constructor(private apptray: ApptrayService) {
    const tempSettings: Setting = JSON.parse(
      localStorage.getItem('apptray-settings') || '{}'
    );

    if (!tempSettings.searchEngine || !tempSettings.emailService) {
      const settings: Setting = {
        searchEngine: 'Google',
        emailService: 'Gmail',
      };
      localStorage.setItem('apptray-settings', JSON.stringify(settings));
    }
  }

  //#region activeControl
  public get activeControl(): activeControls {
    return this._activeControl;
  }
  public set activeControl(value: activeControls) {
    this._activeControl = value;
  }
  //#endregion

  //#region editingApp

  public get editingApp(): string {
    return this._editingApp;
  }
  public set editingApp(value: string) {
    this._editingApp = value;
  }
  //#endregion

  //#region editorToggle

  public get editorToggle(): boolean {
    return this._editorToggle;
  }
  public set editorToggle(value: boolean) {
    this._editorToggle = value;
  }
  //#endregion

  //#region accountToggle

  public get accountToggle(): boolean {
    return this._accountToggle;
  }
  public set accountToggle(value: boolean) {
    this._accountToggle = value;
  }
  //#endregion

  //#region creatorToggle

  public get creatorToggle(): boolean {
    return this._creatorToggle;
  }
  public set creatorToggle(value: boolean) {
    this._creatorToggle = value;
  }
  //#endregion

  //#region urlToggle

  public get urlToggle(): boolean {
    return this._urlToggle;
  }
  public set urlToggle(value: boolean) {
    this._urlToggle = value;
  }
  //#endregion

  //#region imgUploadToggle

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

  //#region emailService
  get emailService(): string {
    const settingObj: Setting = JSON.parse(
      localStorage.getItem('apptray-settings') || '{}'
    );

    return settingObj.emailService;
  }
  set emailService(v: string) {
    const settingObj: Setting = JSON.parse(
      localStorage.getItem('apptray-settings') || '{}'
    );

    settingObj.emailService = v;

    localStorage.setItem('apptray-settings', JSON.stringify(settingObj));
  }
  //#endregion

  //#region selectedApp
  private _selectedApp = -1;
  get selectedApp(): number {
    return this._selectedApp;
  }
  setSelectedApp(value: number, callerClass: AppIconComponent): void {
    this._selectedApp = value;

    if (this._selectedApp > -1 && this._moveToApp > -1) {
      this.apptray.moveApp(this._selectedApp, this._moveToApp).then(() => {
        // resets everything back to how they were at initialization
        this._selectedApp = -1;
        this._moveToApp = -1;
        callerClass.resetSelection();
      });
    }
  }
  //#endregion

  //#region moveToApp

  get moveToApp(): number {
    return this._moveToApp;
  }
  setMoveToApp(value: number, callerClass: AppIconComponent): void {
    this._moveToApp = value;

    if (this._selectedApp > -1 && this._moveToApp > -1) {
      this.apptray.moveApp(this._selectedApp, this._moveToApp).then(() => {
        // resets everything back to how they were at initialization
        this._selectedApp = -1;
        this._moveToApp = -1;
        callerClass.resetSelection();
      });
    }
  }
  //#endregion

  //#region infoToggle
  public get infoToggle(): boolean {
    return this._infoToggle;
  }
  public set infoToggle(v: boolean) {
    this._infoToggle = v;
  }
  //#endregion

  //#region viewingApp
  public get viewingApp(): string {
    return this._viewingApp;
  }
  public set viewingApp(v: string) {
    this._viewingApp = v;
  }
  //#endregion
}
