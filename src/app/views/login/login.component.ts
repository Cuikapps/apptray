import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.router.navigate(['home']);
    }
  }

  createAccount() {
    window.open('https://cuikapps.com/register-user');
  }
}
