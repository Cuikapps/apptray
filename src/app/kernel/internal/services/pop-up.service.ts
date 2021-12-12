import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable()
export class PopUpService {
  constructor() {}

  alerts: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);
  confirms: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);
  errors: BehaviorSubject<Popup[]> = new BehaviorSubject<Popup[]>([]);

  alert(message: string): void {
    const alert = new Popup('alert', message, () => {
      this.alerts.next(this.alerts.value.filter((popup) => popup !== alert));
    });

    this.alerts.next([...this.alerts.value, alert]);
  }

  confirm(message: string, cb: (yes: boolean) => void): void {
    const confirm = new Popup('confirm', message, (yes) => {
      cb(yes);

      this.confirms.next(
        this.confirms.value.filter((popup) => popup !== confirm)
      );
    });

    this.confirms.next([...this.confirms.value, confirm]);
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
    public type: 'alert' | 'confirm' | 'error',
    public message: string,
    public onDelete: (yes: boolean) => void
  ) {
    if (type !== 'confirm') {
      const sub = timer(5000).subscribe(() => {
        sub.unsubscribe();
        onDelete(true);
      });
    }
  }
}
