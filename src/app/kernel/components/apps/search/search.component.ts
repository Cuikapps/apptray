import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemeService } from 'src/app/kernel/internal/services/theme.service';
import { ShellService } from 'src/app/kernel/services/shell.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  constructor(
    public readonly theme: ThemeService,
    public readonly shell: ShellService
  ) {}

  @ViewChild('search') search!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.search.nativeElement.focus();
  }

  query(q: string): void {
    this.shell.run([`search --q="${encodeURIComponent(q)}"`]);
  }
}
