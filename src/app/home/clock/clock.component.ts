import { Component, OnInit } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit {
  time!: Observable<string>;

  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {}

  ngOnInit(): void {
    this.time = interval(1000).pipe(
      map((num) => {
        const date = new Date();

        return `${this.createDate(date)}  ${this.createTime(date)}`;
      })
    );
  }

  monthName(num: number): string {
    return this.monthNames[num];
  }

  dayName(num: number): string {
    return this.dayNames[num];
  }

  createDate(date: Date): string {
    return `
    ${this.dayName(date.getDay())} ${this.monthName(date.getMonth())}
     ${date.getDate()},`;
  }

  createTime(date: Date): string {
    let hours = `${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }`;

    // Add a '0' to the beginning if it only one digit
    if (hours.length < 2) {
      hours = `0${hours}`;
    }
    let minutes = `${date.getMinutes()} ${date.getHours() > 11 ? 'PM' : 'AM'}`;

    // Add a '0' to the beginning if it only one digit
    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }
}
