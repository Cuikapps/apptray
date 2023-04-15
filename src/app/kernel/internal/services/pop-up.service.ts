import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable()
export class PopUpService {
  constructor() {}

  alerts: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);
  confirms: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);
  inputs: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);
  errors: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);

  alert(message: string): void {
    const alert = new Popup('alert', message, () => {
      this.alerts.next(this.alerts.value.filter((popup) => popup !== alert));
    });

    this.alerts.next([...this.alerts.value, alert]);
  }

  confirm(message: string, cb: (yes: boolean) => void): void {
    const confirm = new Popup('confirm', message, (yes) => {
      cb(yes as boolean);

      this.confirms.next(
        this.confirms.value.filter((popup) => popup !== confirm)
      );
    });

    this.confirms.next([...this.confirms.value, confirm]);
  }

  input(message: string, regex: RegExp, cb: (value: string) => void): void {
    const input = new Popup('input', message, (value) => {
      const str = value as string;

      if (str.match(regex)) {
        cb(str);
      }

      this.inputs.next(this.inputs.value.filter((popup) => popup !== input));
    });

    this.inputs.next([...this.inputs.value, input]);
  }

  error(message: string): void {
    const error = new Popup('error', message, () => {
      this.errors.next(this.errors.value.filter((popup) => popup !== error));
    });

    this.errors.next([...this.errors.value, error]);
  }
}

export class Popup {
  constructor(
    public type: 'alert' | 'confirm' | 'input' | 'error',
    public message: string,
    public onDelete: (v: boolean | string) => void
  ) {
    if (type !== 'confirm') {
      const sub = timer(5000).subscribe(() => {
        sub.unsubscribe();
        onDelete(true);
      });
    }
  }
}
