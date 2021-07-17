import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'cuik-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.scss'],
})
export class ImgUploadComponent implements OnInit {
  constructor(private renderer2: Renderer2) {}

  @ViewChild('img1') img1!: ElementRef<HTMLInputElement>;

  @Output() files: EventEmitter<File[]> = new EventEmitter<File[]>();

  images: File[] = [];

  ngOnInit(): void {}

  inputChange(input: HTMLInputElement): void {
    this.renderer2.addClass(input.parentElement, 'selected-file');
  }

  submit(): void {
    //#region If image size is less 1 mb then it is added to images array

    // Images Check
    if (
      this.img1.nativeElement.files &&
      this.img1.nativeElement.files.length > 0
    ) {
      if (this.checkSize(this.img1)) {
        this.images.push(this.img1.nativeElement.files[0]);
      } else {
        alert('Image 1 must be less than 1mb');
        return;
      }
    }
    //#endregion

    if (this.images.length < 1) {
      alert('You must have one image');
    } else {
      this.files.emit(this.images);
    }
  }

  checkSize(input: ElementRef<HTMLInputElement>): boolean {
    if (input.nativeElement.files) {
      if (input.nativeElement.files[0].size <= 1048569) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
