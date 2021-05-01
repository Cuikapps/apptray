import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {}

  private _activeControl: string = 'none';

  public get activeControl() {
    return this._activeControl;
  }
  public set activeControl(value: string) {
    this._activeControl = value;
  }
}
