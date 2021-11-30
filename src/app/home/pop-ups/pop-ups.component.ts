import { Component, OnInit } from '@angular/core';
import { PopUpService } from 'src/app/kernel/internal/services/pop-up.service';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';

@Component({
  selector: 'app-pop-ups',
  templateUrl: './pop-ups.component.html',
  styleUrls: ['./pop-ups.component.scss'],
})
export class PopUpsComponent implements OnInit {
  constructor(
    public readonly popup: PopUpService,
    public readonly theme: ThemeService
  ) {}

  ngOnInit(): void {}
}
