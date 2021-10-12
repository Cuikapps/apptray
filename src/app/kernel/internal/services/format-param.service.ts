import { Injectable } from '@angular/core';

@Injectable()
export class FormatParamService {
  constructor() {}

  format(param: string): string {
    param = this.removeQuotes(param);

    return param;
  }

  private removeQuotes(quote: string): string {
    return quote.includes('"')
      ? this.removeQuotes(quote.replace('"', ''))
      : quote;
  }
}
