import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'cuik-star-view',
  templateUrl: './star-view.component.html',
  styleUrls: ['./star-view.component.scss'],
})
export class StarViewComponent implements OnInit, OnChanges {
  constructor() {}

  @Input() stars!: number;
  @Input() hovColor = false;

  svgStroke = '#e7e7de';

  ngOnInit(): void {
    if (this.stars > 5) {
      console.error("ERROR: The app's rating is over 5 stars");
    }
  }

  ngOnChanges() {
    if (this.hovColor) {
      this.svgStroke = '#DADAD1';
    } else {
      this.svgStroke = '#e7e7de';
    }
  }
}
