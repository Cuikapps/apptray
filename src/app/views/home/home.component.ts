import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthService) {}

  accountToggle: boolean = false;
  creatorToggle: boolean = false;

  ngOnInit(): void {}

  goToDash() {
    window.open('https://cuikapps.com/dashboard');
  }
}
