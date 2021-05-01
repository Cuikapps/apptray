import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'cuik-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
})
export class SidePanelComponent implements OnInit {
  constructor(public state: StateService) {}

  ngOnInit(): void {}

  /**
   *
   * @param button
   * @see activeControl
   * if is already equal to the @param button then it is set to 'none'
   */
  activateControl(button: string) {
    if (this.state.activeControl == button) this.state.activeControl = 'none';
    else this.state.activeControl = button;
  }
}
 