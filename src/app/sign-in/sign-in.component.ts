import { Component, OnInit } from '@angular/core';
import { ShellService } from '../kernel/services/shell.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private readonly shell: ShellService) {}

  ngOnInit(): void {}

  submit(email: string, pass: string): void {
    this.shell.run([`sign-in --email="${email}" --password="${pass}"`]);
  }
}
