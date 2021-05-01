import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor() {}

  Error(msg: any) {
    console.log(
      '%c ERROR:' + new Date() + ': ' + JSON.stringify(msg),
      'color: red'
    );
  }
  Warning(msg: any) {
    console.log(
      '%c Warning:' + new Date() + ': ' + JSON.stringify(msg),
      'color: yellow'
    );
  }
  Print(msg: any) {
    console.log(new Date() + ': ' + JSON.stringify(msg));
  }
}
