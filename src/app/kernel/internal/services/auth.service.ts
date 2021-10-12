import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../interface/iuser';
import { Param } from '../../interface/Param';
import { AuthURLs } from '../data/EApiUrls';
import { CookieService } from './cookie.service';
import { FormatParamService } from './format-param.service';
import { LoadingService } from './loading.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly cookie: CookieService,
    private readonly loading: LoadingService,
    private readonly formatParam: FormatParamService
  ) {
    if (this.isLoggedIn) {
      this.getStoreData();
    }
  }

  storeData: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    null
  );

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': 'https://cuikapps.uc.r.appspot.com',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
  });

  async signIn(params: Param): Promise<void> {
    const email = this.formatParam.format(params.email);
    const password = this.formatParam.format(params.password);

    console.log(email);

    try {
      await this.loading.load<void>(async () => {
        await firstValueFrom(
          this.http.post<void>(
            environment.apiURL + AuthURLs.SIGN_IN,
            {
              email,
              password,
            },
            { withCredentials: true }
          )
        );

        this.cookie.setCookie('isLoggedIn', 'true', 30 * 24 * 60 * 60);
        localStorage.setItem('current-email', email);
      });
    } catch (error) {
      this.cookie.deleteCookie('isLoggedIn');
      alert('Either Password or Email was entered incorrectly');
      console.error(error);
      throw new Error(error as string);
    }

    await this.getStoreData();

    this.router.navigate(['/home']);
  }

  async getStoreData(): Promise<void> {
    try {
      const user = await this.loading.load<IUser | null>(async () => {
        if (this.isLoggedIn) {
          return firstValueFrom(
            this.http.get<IUser>(environment.apiURL + AuthURLs.GET_USER, {
              headers: this.headers,
              withCredentials: true,
            })
          );
        } else {
          return null;
        }
      });
      this.storeData.next(user);
    } catch (error) {
      console.error(error);
    }
  }

  get isLoggedIn(): boolean {
    if (this.cookie.getCookie('isLoggedIn')) {
      return true;
    } else {
      return false;
    }
  }
}
