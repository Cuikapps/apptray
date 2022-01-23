import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';

@Pipe({
  name: 'timeRemaining',
})
export class TimeRemainingPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) public readonly locale: string) {}

  transform(milliseconds: number, ...args: unknown[]): string {
    const seconds = Math.round(milliseconds / 1000);
    const minutes = Math.round(milliseconds / 1000 / 60);
    const hours = Math.round(milliseconds / 1000 / 60 / 60);

    return `${formatNumber(hours, this.locale, '2.0-0')}:${formatNumber(
      minutes,
      this.locale,
      '2.0-0'
    )}:${formatNumber(seconds, this.locale, '2.0-0')}`;
  }
}
