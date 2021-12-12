import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  Popup,
  PopUpService,
} from 'src/app/kernel/internal/services/pop-up.service';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';

@Component({
  selector: 'app-pop-ups',
  templateUrl: './pop-ups.component.html',
  styleUrls: ['./pop-ups.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ marginTop: 'unset' })),

      // fade in when created. this could also be written as transition('void => *')
      transition(
        ':enter',
        animate('100ms 0ms ease-out', style({ marginTop: 'unset' }))
      ),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(
        ':leave',
        animate('300ms 0ms ease-in', style({ marginTop: '-300px' }))
      ),
    ]),
  ],
})
export class PopUpsComponent implements OnInit {
  constructor(
    public readonly popup: PopUpService,
    public readonly theme: ThemeService
  ) {}

  ngOnInit(): void {}
}
