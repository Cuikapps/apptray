import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  constructor() {}

  getCookie(cname: string): string | null {
    // Split cookie string and get all individual name=value pairs in an array
    const cookieArr = document.cookie.split(';');

    // Loop through the array elements
    for (const cookie of cookieArr) {
      const cookiePair = cookie.split('=');

      if (cookiePair[0].includes(' ')) {
        cookiePair[0] = cookiePair[0].replace(' ', '');
      }

      /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
      if (cname === cookiePair[0]) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    return null;
  }

  setCookie(cname: string, cvalue: string, age: number): void {
    document.cookie = `${cname}=${cvalue}; max-age=${age}`;
  }

  deleteCookie(cname: string): void {
    document.cookie = `${cname}=a; max-age=${-60}`;
  }
}
