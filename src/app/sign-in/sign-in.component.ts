import { Component, OnInit } from '@angular/core';
import { AuthService } from '../kernel/internal/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {}

  submit(email: string, pass: string): void {
    this.auth.signIn(email, pass);
  }
}
