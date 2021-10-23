import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { App } from 'src/app/kernel/interface/app';
import { DesktopService } from 'src/app/kernel/services/desktop.service';
import { StateService } from 'src/app/kernel/services/state.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() app!: App;

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  isMenuOpen = false;

  constructor(
    public readonly state: StateService,
    public readonly desktop: DesktopService,
    private readonly renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (!this.container.nativeElement.contains(e.target as Node)) {
        this.isMenuOpen = false;
      }
    });
    this.renderer.listen('window', 'contextmenu', (e: Event) => {
      if (!this.container.nativeElement.contains(e.target as Node)) {
        this.isMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {}

  unminimize(e: MouseEvent): void {
    if (e.button === 0) {
      this.isMenuOpen = false;
      this.state.unminimizeApp(this.app.id);
    }
  }
}
